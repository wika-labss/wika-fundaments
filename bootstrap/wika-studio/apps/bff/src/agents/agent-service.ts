import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type {
  AgentId,
  CreateSessionRequest,
  ImageAttachment,
  ModelInfo,
  Owner,
  SendMessageRequest,
  SessionDetail,
  SessionEvent,
  SessionSummary,
} from "@wika-studio/wika-client";
import { CHAT_AGENTS } from "@wika-studio/wika-client";
import type { CheckpointService } from "../checkpoints/checkpoint-service.js";
import type { StudioConfig } from "../config.js";
import type { EventLog } from "../events/event-log.js";
import {
  HttpError,
  defaultIteration,
  iterationDir,
  readProjectFlags,
  requireProjectDir,
  resolveStateId,
} from "../projects.js";
import type { SettingsStore } from "../settings.js";
import { getAgentSpec } from "./catalog.js";
import type { GateGuard } from "./gate-guard.js";
import type { PromptBuilder } from "./prompt-builder.js";
import type { AgentRuntime, RuntimeRun, RuntimeSession } from "./runtime.js";

interface SessionRecord {
  summary: SessionSummary;
  history: SessionEvent[];
  subscribers: Set<(e: SessionEvent) => void>;
  runtimeSession?: RuntimeSession;
  activeRun?: RuntimeRun;
  messageCount: number;
}

export interface AgentServiceDeps {
  config: StudioConfig;
  runtime: AgentRuntime;
  promptBuilder: PromptBuilder;
  gateGuard: GateGuard;
  checkpoints: CheckpointService;
  events: EventLog;
  settings: SettingsStore;
  log?: (msg: string) => void;
}

const MAX_HISTORY = 2000;

/**
 * Sesiones de chat con agentes WIKA (docs/studio-api-contract.md → Sesiones):
 * precheck de gates → prompt → run del runtime → postcheck/revert → checkpoint.
 */
export class AgentService {
  private readonly sessions = new Map<string, SessionRecord>();
  private modelCache: { at: number; models: ModelInfo[] } | null = null;

  constructor(private readonly deps: AgentServiceDeps) {}

  // ---------------------------------------------------------------- modelos

  async listModels(): Promise<ModelInfo[]> {
    if (this.modelCache && Date.now() - this.modelCache.at < 5 * 60_000) return this.modelCache.models;
    const models = await this.deps.runtime.listModels();
    this.modelCache = { at: Date.now(), models };
    return models;
  }

  async resolveModel(owner: Owner, requested?: string | null): Promise<string> {
    const models = await this.listModels();
    if (requested) {
      if (!models.some((m) => m.id === requested)) {
        throw new HttpError(400, "UNKNOWN_MODEL", `modelo ${requested} no está en el catálogo`);
      }
      return requested;
    }
    const preferred = this.deps.settings.getDefaultModel(owner.email);
    if (preferred && models.some((m) => m.id === preferred)) return preferred;
    if (models.length === 0) throw new HttpError(503, "NO_MODELS", "el runtime no devolvió modelos");
    return models[0].id;
  }

  // --------------------------------------------------------------- sesiones

  listSessions(projectId: string): SessionSummary[] {
    requireProjectDir(projectId);
    return [...this.sessions.values()]
      .filter((s) => s.summary.project_id === projectId)
      .map((s) => this.summaryOf(s));
  }

  async createSession(projectId: string, req: CreateSessionRequest, owner: Owner): Promise<SessionSummary> {
    requireProjectDir(projectId);
    const agentId = req.agent_id;
    if (!CHAT_AGENTS.includes(agentId)) {
      throw new HttpError(400, "BAD_AGENT", `agente ${agentId} no disponible en chat (${CHAT_AGENTS.join(", ")})`);
    }
    const iteration = req.iteration ?? defaultIteration(projectId);
    const flags = readProjectFlags(projectId);
    const mode = flags.project_mode ?? "construction";
    const ctx = { mode, iteration, flags };
    const blocked = this.deps.gateGuard.precheck(agentId, ctx);
    if (blocked) throw new HttpError(409, "GATE_BLOCKED", `gate pendiente: ${blocked.missing_flag}`, blocked);

    const modelId = await this.resolveModel(owner, req.model_id);
    const record: SessionRecord = {
      summary: {
        session_id: `ses_${crypto.randomUUID().slice(0, 12)}`,
        project_id: projectId,
        agent_id: agentId,
        model_id: modelId,
        iteration,
        allowed_paths: this.deps.gateGuard.allowedPaths(agentId, ctx),
        created_at: new Date().toISOString(),
        active_run_id: null,
        message_count: 0,
      },
      history: [],
      subscribers: new Set(),
      messageCount: 0,
    };
    this.sessions.set(record.summary.session_id, record);
    return this.summaryOf(record);
  }

  getSession(projectId: string, sessionId: string): SessionDetail {
    const record = this.require(projectId, sessionId);
    return { ...this.summaryOf(record), history: record.history };
  }

  subscribe(projectId: string, sessionId: string, fn: (e: SessionEvent) => void): { history: SessionEvent[]; unsubscribe: () => void } {
    const record = this.require(projectId, sessionId);
    record.subscribers.add(fn);
    return { history: record.history, unsubscribe: () => record.subscribers.delete(fn) };
  }

  async cancel(projectId: string, sessionId: string): Promise<void> {
    const record = this.require(projectId, sessionId);
    await record.activeRun?.cancel();
  }

  async closeAll(): Promise<void> {
    for (const s of this.sessions.values()) {
      await s.activeRun?.cancel().catch(() => undefined);
      await s.runtimeSession?.close().catch(() => undefined);
    }
  }

  // --------------------------------------------------------------- mensajes

  async sendMessage(projectId: string, sessionId: string, req: SendMessageRequest, owner: Owner): Promise<string> {
    const record = this.require(projectId, sessionId);
    if (record.summary.active_run_id) {
      throw new HttpError(409, "SESSION_BUSY", "hay un run activo en esta sesión");
    }
    if (!req.text?.trim() && !(req.images?.length)) {
      throw new HttpError(400, "BAD_REQUEST", "text es obligatorio");
    }
    const projectDir = requireProjectDir(projectId);
    const flags = readProjectFlags(projectId);
    const mode = flags.project_mode ?? "construction";
    const { agent_id: agentId, iteration } = record.summary;
    const ctx = { mode, iteration, flags };
    const blocked = this.deps.gateGuard.precheck(agentId, ctx);
    if (blocked) throw new HttpError(409, "GATE_BLOCKED", `gate pendiente: ${blocked.missing_flag}`, blocked);

    const modelId = await this.resolveModel(owner, req.model_id ?? record.summary.model_id);
    record.summary.model_id = modelId;
    const runId = `run_${crypto.randomUUID().slice(0, 12)}`;
    record.summary.active_run_id = runId;
    record.messageCount++;

    const savedImages = this.saveImages(projectDir, iteration, req.images ?? []);
    const allowed = this.deps.gateGuard.allowedPaths(agentId, ctx);
    const prompt = this.deps.promptBuilder.build({
      agentId,
      projectId,
      projectDir,
      fundamentsRoot: this.deps.config.fundamentsRoot,
      mode,
      stateId: resolveStateId(flags),
      flags,
      iteration,
      allowedPaths: allowed,
      userText: req.text ?? "",
      firstMessage: record.messageCount === 1,
      maxDocChars: this.deps.config.maxPromptDocChars,
    });

    this.emit(record, { event: "user.message", data: { run_id: runId, text: req.text ?? "", image_names: savedImages.map((i) => i.name), at: now() } });
    this.emit(record, { event: "run.started", data: { run_id: runId, agent_id: agentId, model_id: modelId, prompt_summary: prompt.summary, at: now() } });

    void this.execute(record, runId, prompt.text, savedImages, allowed, owner).catch((err: Error) => {
      this.deps.log?.(`[agents] run ${runId} error: ${err.message}`);
      this.emit(record, { event: "run.finished", data: { run_id: runId, status: "failed", error: err.message, at: now() } });
      record.summary.active_run_id = null;
      record.activeRun = undefined;
    });
    return runId;
  }

  // ------------------------------------------------------------ ejecución

  private async execute(
    record: SessionRecord,
    runId: string,
    promptText: string,
    images: Array<{ name: string; mimeType: string; dataBase64: string }>,
    allowed: string[],
    owner: Owner,
  ): Promise<void> {
    const { project_id: projectId, agent_id: agentId, iteration } = record.summary;
    const modelId = record.summary.model_id ?? "";
    const checkpoints = this.deps.checkpoints;
    const started = Date.now();

    // Línea base limpia: lo que haya sin commitear se guarda antes del run.
    checkpoints.commit(projectId, "auto: cambios previos al run", { kind: "manual" });
    const before = checkpoints.snapshotDocs(projectId);

    this.deps.events.append(
      projectId,
      "job.started",
      { agent_id: agentId, model_id: modelId, run_id: runId, iteration, session_id: record.summary.session_id },
      { kind: "human", subject_id: owner.email },
      runId,
    );

    const session = await this.ensureRuntimeSession(record, modelId);
    const run = await session.send(
      { text: promptText, images: images.map((i) => ({ mimeType: i.mimeType, dataBase64: i.dataBase64 })) },
      modelId,
      {
        onDelta: (text) => this.emit(record, { event: "assistant.delta", data: { run_id: runId, text } }, false),
        onMessage: (text) => this.emit(record, { event: "assistant.message", data: { run_id: runId, text, at: now() } }),
        onToolCall: (call) =>
          this.emit(record, { event: "tool.call", data: { run_id: runId, call_id: call.callId, name: call.name, status: call.status, path: call.path } }),
      },
    );
    record.activeRun = run;
    const result = await run.done;

    // Postcheck: revertir violaciones.
    const changed = checkpoints.changedFiles(projectId);
    const violations = this.deps.gateGuard.postcheck(changed, allowed, before, (rel) => checkpoints.readProjectFile(projectId, rel));
    if (violations.length) {
      checkpoints.revertPaths(projectId, violations.map((v) => v.path));
      for (const v of violations) {
        this.emit(record, { event: "guard.violation", data: { run_id: runId, path: v.path, reason: v.reason, action: "reverted" } });
      }
    }

    let checkpointId: string | undefined;
    if (result.status !== "cancelled" || changed.length) {
      const cp = checkpoints.commit(projectId, `${agentId}: ${summarizeForCommit(promptText)}`, {
        kind: "run",
        agent_id: agentId,
        model_id: modelId,
        run_id: runId,
      });
      if (cp) {
        checkpointId = cp.checkpoint_id;
        this.emit(record, { event: "checkpoint.created", data: { run_id: runId, checkpoint_id: cp.checkpoint_id, summary: cp.summary } });
        this.deps.events.append(projectId, "iteration.created", { iteration, checkpoint_id: cp.checkpoint_id, files_changed: cp.files_changed }, { kind: "ia", subject_id: agentId }, runId);
      }
    }

    this.deps.events.append(
      projectId,
      "job.completed",
      {
        agent_id: agentId,
        model_id: modelId,
        run_id: runId,
        status: result.status,
        duration_ms: result.durationMs ?? Date.now() - started,
        usage: result.usage,
        violations: violations.length,
        checkpoint_id: checkpointId,
        error: result.error,
      },
      { kind: "ia", subject_id: agentId },
      runId,
    );

    record.summary.active_run_id = null;
    record.activeRun = undefined;
    this.emit(record, {
      event: "run.finished",
      data: { run_id: runId, status: result.status, usage: result.usage, duration_ms: result.durationMs, error: result.error, at: now() },
    });
  }

  private async ensureRuntimeSession(record: SessionRecord, modelId: string): Promise<RuntimeSession> {
    if (record.runtimeSession) return record.runtimeSession;
    const { project_id: projectId, agent_id: agentId, iteration } = record.summary;
    const spec = getAgentSpec(agentId);
    const worksInIteration = spec.allowedPaths({ mode: "exploration", iteration, flags: {} }).some((p) => p.startsWith("iterations/"));
    const cwd = worksInIteration ? iterationDir(projectId, iteration) : requireProjectDir(projectId);
    if (!fs.existsSync(cwd)) fs.mkdirSync(cwd, { recursive: true });
    const stateDir = path.join(this.deps.config.dataDir, "sdk", projectId);
    fs.mkdirSync(stateDir, { recursive: true });
    record.runtimeSession = await this.deps.runtime.openSession({
      sessionId: record.summary.session_id,
      cwd,
      stateDir,
      modelId,
      name: `${projectId} · ${agentId}`,
      disallowedTools: spec.disallowedTools,
    });
    return record.runtimeSession;
  }

  private saveImages(projectDir: string, iteration: string, images: ImageAttachment[]): Array<{ name: string; mimeType: string; dataBase64: string }> {
    if (!images.length) return [];
    const iterationAssets = path.join(projectDir, "iterations", iteration, "assets");
    const dir = fs.existsSync(path.dirname(iterationAssets)) ? iterationAssets : path.join(projectDir, "idea", "assets");
    fs.mkdirSync(dir, { recursive: true });
    return images.slice(0, 5).map((img) => {
      const name = sanitizeName(img.name) || `imagen-${Date.now()}.png`;
      fs.writeFileSync(path.join(dir, name), Buffer.from(img.data_base64, "base64"));
      return { name, mimeType: img.mime_type, dataBase64: img.data_base64 };
    });
  }

  private emit(record: SessionRecord, event: SessionEvent, persist = true): void {
    if (persist) {
      record.history.push(event);
      if (record.history.length > MAX_HISTORY) record.history.splice(0, record.history.length - MAX_HISTORY);
    }
    for (const fn of record.subscribers) {
      try {
        fn(event);
      } catch {
        /* suscriptor cerrado */
      }
    }
  }

  private require(projectId: string, sessionId: string): SessionRecord {
    const record = this.sessions.get(sessionId);
    if (!record || record.summary.project_id !== projectId) {
      throw new HttpError(404, "SESSION_NOT_FOUND", `sesión ${sessionId} no existe`);
    }
    return record;
  }

  private summaryOf(record: SessionRecord): SessionSummary {
    return { ...record.summary, message_count: record.messageCount };
  }
}

export function sanitizeName(name: string): string {
  return path
    .basename(name)
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function summarizeForCommit(prompt: string): string {
  const m = prompt.match(/# Mensaje del dueño\n\n([\s\S]*?)\n\n---/);
  const text = (m ? m[1] : prompt).replace(/\s+/g, " ").trim();
  return text.length > 72 ? `${text.slice(0, 71)}…` : text;
}

function now(): string {
  return new Date().toISOString();
}

export type { AgentId };
