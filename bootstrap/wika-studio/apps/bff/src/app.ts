import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import type {
  AssetInfo,
  CreateProjectRequest,
  CreateSessionRequest,
  ProjectState,
  SendMessageRequest,
  SessionEvent,
  UploadAssetRequest,
} from "@wika-studio/wika-client";
import { AgentService } from "./agents/agent-service.js";
import { CursorSdkRuntime } from "./agents/cursor-sdk-runtime.js";
import { GateGuard } from "./agents/gate-guard.js";
import { MockRuntime } from "./agents/mock-runtime.js";
import { PromptBuilder } from "./agents/prompt-builder.js";
import type { AgentRuntime } from "./agents/runtime.js";
import { requireOwner } from "./auth/owner-auth.js";
import { authRouter } from "./auth/routes.js";
import { CheckpointService } from "./checkpoints/checkpoint-service.js";
import type { StudioConfig } from "./config.js";
import { EventLog } from "./events/event-log.js";
import { PreviewManager } from "./preview/preview-manager.js";
import { bootstrapProject } from "./projects/bootstrap.js";
import {
  HttpError,
  defaultIteration,
  iterationDir,
  listIterations,
  listProjects,
  readProjectFlags,
  requireProjectDir,
  resolveStateId,
  suggestedAgent,
  validateProjectStructure,
} from "./projects.js";
import { SettingsStore } from "./settings.js";

export interface StudioApp {
  app: Express;
  services: {
    agents: AgentService;
    previews: PreviewManager;
    checkpoints: CheckpointService;
    events: EventLog;
    runtime: AgentRuntime;
  };
  shutdown(): Promise<void>;
}

export interface CreateAppOptions {
  config: StudioConfig;
  runtime?: AgentRuntime;
  previews?: PreviewManager;
  log?: (msg: string) => void;
}

export function createApp(options: CreateAppOptions): StudioApp {
  const { config } = options;
  const log = options.log ?? ((m: string) => console.log(m));
  const runtime: AgentRuntime =
    options.runtime ?? (config.runtime === "cursor-sdk" && config.cursorApiKey ? new CursorSdkRuntime(config.cursorApiKey) : new MockRuntime());
  const checkpoints = new CheckpointService(config.proyectosRoot);
  const events = new EventLog();
  const settings = new SettingsStore(config.dataDir);
  const previews = options.previews ?? new PreviewManager({ portRange: config.previewPortRange, log });
  const agents = new AgentService({
    config,
    runtime,
    promptBuilder: new PromptBuilder(),
    gateGuard: new GateGuard(),
    checkpoints,
    events,
    settings,
    log,
  });

  const app = express();
  app.disable("x-powered-by");
  app.use(cors({ origin: [config.webOrigin], credentials: true }));
  app.use(express.json({ limit: "25mb" }));

  const api = express.Router();
  app.use("/api/v1", api);

  type Handler = (req: Request, res: Response) => void | Promise<void>;
  const h =
    (fn: Handler) =>
    (req: Request, res: Response, next: NextFunction): void => {
      Promise.resolve()
        .then(() => fn(req, res))
        .catch(next);
    };

  api.get("/health", h((_req, res) => {
    res.json({ status: "ok", service: "wika-studio-bff", runtime: runtime.kind, auth_configured: config.owners.length > 0 && !!config.passwordHash });
  }));
  api.use("/auth", authRouter(config));
  api.use(requireOwner(config));

  // ------------------------------------------------------------- proyectos
  api.get("/projects", h((_req, res) => {
    res.json({ projects: listProjects() });
  }));

  api.post("/projects", h((req, res) => {
    const body = req.body as CreateProjectRequest;
    if (!body?.project_id || !body.project_mode || !body.solution_type) {
      throw new HttpError(400, "BAD_REQUEST", "project_id, project_mode y solution_type son obligatorios");
    }
    const result = bootstrapProject(body);
    checkpoints.commit(body.project_id, `bootstrap ${body.project_id}`, { kind: "bootstrap", agent_id: "wika-bootstrap" });
    events.append(body.project_id, "project.created", { mode: body.project_mode, solution_type: body.solution_type, files: result.created_files.length }, { kind: "human", subject_id: req.owner?.email });
    events.append(body.project_id, "iteration.created", { iteration: "prototype", source: "template" }, { kind: "ia", subject_id: "wika-bootstrap" });
    res.status(201).json(result);
  }));

  api.get("/projects/:id", h((req, res) => {
    requireProjectDir(req.params.id);
    res.json({ project_id: req.params.id, flags: readProjectFlags(req.params.id), iterations: listIterations(req.params.id) });
  }));

  api.get("/projects/:id/state", h((req, res) => {
    requireProjectDir(req.params.id);
    const flags = readProjectFlags(req.params.id);
    const state_id = resolveStateId(flags);
    const mode = flags.project_mode ?? "construction";
    const body: ProjectState = {
      project_id: req.params.id,
      state_id,
      suggested_agent: suggestedAgent(state_id, mode),
      mode,
      flags,
      iterations: listIterations(req.params.id),
    };
    res.json(body);
  }));

  api.post("/projects/:id/validate", h((req, res) => {
    const result = validateProjectStructure(req.params.id);
    if (fs.existsSync(path.join(config.proyectosRoot, "app", req.params.id))) {
      events.append(req.params.id, "validation.run", { ok: result.ok, findings: result.findings.length }, { kind: "human", subject_id: req.owner?.email });
    }
    res.json(result);
  }));

  api.get("/projects/:id/events", h((req, res) => {
    requireProjectDir(req.params.id);
    res.json({ events: events.list(req.params.id) });
  }));

  api.get("/projects/:id/iterations", h((req, res) => {
    requireProjectDir(req.params.id);
    res.json({ iterations: listIterations(req.params.id), default: defaultIteration(req.params.id) });
  }));

  // --------------------------------------------------------------- modelos
  api.get("/models", h(async (req, res) => {
    const models = await agents.listModels();
    const owner = req.owner!;
    const preferred = settings.getDefaultModel(owner.email);
    res.json({ models, default_model_id: preferred && models.some((m) => m.id === preferred) ? preferred : (models[0]?.id ?? null), runtime: runtime.kind });
  }));

  api.put("/models/default", h(async (req, res) => {
    const modelId = (req.body as { model_id?: string }).model_id;
    if (!modelId) throw new HttpError(400, "BAD_REQUEST", "model_id es obligatorio");
    const models = await agents.listModels();
    if (!models.some((m) => m.id === modelId)) throw new HttpError(400, "UNKNOWN_MODEL", "modelo fuera del catálogo");
    settings.setDefaultModel(req.owner!.email, modelId);
    res.json({ default_model_id: modelId });
  }));

  // -------------------------------------------------------------- sesiones
  api.get("/projects/:id/sessions", h((req, res) => {
    res.json({ sessions: agents.listSessions(req.params.id) });
  }));

  api.post("/projects/:id/sessions", h(async (req, res) => {
    const session = await agents.createSession(req.params.id, req.body as CreateSessionRequest, req.owner!);
    res.status(201).json(session);
  }));

  api.get("/projects/:id/sessions/:sid", h((req, res) => {
    res.json(agents.getSession(req.params.id, req.params.sid));
  }));

  api.post("/projects/:id/sessions/:sid/messages", h(async (req, res) => {
    const runId = await agents.sendMessage(req.params.id, req.params.sid, req.body as SendMessageRequest, req.owner!);
    res.status(202).json({ run_id: runId });
  }));

  api.post("/projects/:id/sessions/:sid/cancel", h(async (req, res) => {
    await agents.cancel(req.params.id, req.params.sid);
    res.status(202).json({ ok: true });
  }));

  api.get("/projects/:id/sessions/:sid/stream", h((req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    const write = (e: SessionEvent) => {
      res.write(`event: ${e.event}\ndata: ${JSON.stringify(e.data)}\n\n`);
    };
    const { history, unsubscribe } = agents.subscribe(req.params.id, req.params.sid, write);
    for (const e of history) write(e);
    res.write(`event: ready\ndata: {}\n\n`);
    const ping = setInterval(() => res.write(": ping\n\n"), 20_000);
    req.on("close", () => {
      clearInterval(ping);
      unsubscribe();
    });
  }));

  // -------------------------------------------------------------- previews
  api.get("/projects/:id/iterations/:name/preview", h((req, res) => {
    iterationDir(req.params.id, req.params.name);
    res.json(previews.get(req.params.id, req.params.name));
  }));

  api.post("/projects/:id/iterations/:name/preview/start", h(async (req, res) => {
    const dir = iterationDir(req.params.id, req.params.name);
    if (!fs.existsSync(dir)) throw new HttpError(404, "ITERATION_NOT_FOUND", `iteración ${req.params.name} no existe`);
    try {
      res.status(202).json(await previews.start(req.params.id, req.params.name, dir));
    } catch (err) {
      throw new HttpError(409, "PREVIEW_FAILED", (err as Error).message);
    }
  }));

  api.post("/projects/:id/iterations/:name/preview/stop", h(async (req, res) => {
    iterationDir(req.params.id, req.params.name);
    res.json(await previews.stop(req.params.id, req.params.name));
  }));

  api.get("/projects/:id/iterations/:name/preview/logs", h((req, res) => {
    iterationDir(req.params.id, req.params.name);
    res.json({ lines: previews.logs(req.params.id, req.params.name) });
  }));

  // ---------------------------------------------------------------- assets
  api.get("/projects/:id/iterations/:name/assets", h((req, res) => {
    const dir = path.join(iterationDir(req.params.id, req.params.name), "assets");
    res.json({ assets: listAssets(dir, `/api/v1/projects/${req.params.id}/iterations/${req.params.name}/assets`) });
  }));

  api.post("/projects/:id/iterations/:name/assets", h((req, res) => {
    const body = req.body as UploadAssetRequest;
    if (!body?.name || !body.data_base64) throw new HttpError(400, "BAD_REQUEST", "name y data_base64 son obligatorios");
    const dir = path.join(iterationDir(req.params.id, req.params.name), "assets");
    fs.mkdirSync(dir, { recursive: true });
    const safe = safeAssetName(body.name);
    fs.writeFileSync(path.join(dir, safe), Buffer.from(body.data_base64, "base64"));
    checkpoints.commit(req.params.id, `asset: ${safe}`, { kind: "manual" });
    res.status(201).json(listAssets(dir, `/api/v1/projects/${req.params.id}/iterations/${req.params.name}/assets`).find((a) => a.name === safe));
  }));

  api.get("/projects/:id/iterations/:name/assets/:asset", h((req, res) => {
    const dir = path.join(iterationDir(req.params.id, req.params.name), "assets");
    const file = path.join(dir, safeAssetName(req.params.asset));
    if (!fs.existsSync(file)) throw new HttpError(404, "ASSET_NOT_FOUND", "asset no existe");
    res.type(mimeFor(file)).send(fs.readFileSync(file));
  }));

  api.delete("/projects/:id/iterations/:name/assets/:asset", h((req, res) => {
    const dir = path.join(iterationDir(req.params.id, req.params.name), "assets");
    const file = path.join(dir, safeAssetName(req.params.asset));
    if (fs.existsSync(file)) fs.rmSync(file);
    checkpoints.commit(req.params.id, `asset eliminado: ${req.params.asset}`, { kind: "manual" });
    res.status(204).end();
  }));

  // ----------------------------------------------------------- checkpoints
  api.get("/projects/:id/checkpoints", h((req, res) => {
    requireProjectDir(req.params.id);
    res.json({ checkpoints: checkpoints.list(req.params.id) });
  }));

  api.post("/projects/:id/checkpoints", h((req, res) => {
    requireProjectDir(req.params.id);
    const summary = (req.body as { summary?: string }).summary?.trim() || "checkpoint manual";
    const cp = checkpoints.commit(req.params.id, summary, { kind: "manual" });
    if (!cp) throw new HttpError(409, "NO_CHANGES", "no hay cambios que guardar");
    res.status(201).json(cp);
  }));

  api.get("/projects/:id/checkpoints/:cid/diff", h((req, res) => {
    requireProjectDir(req.params.id);
    res.json(checkpoints.diff(req.params.id, req.params.cid));
  }));

  api.post("/projects/:id/checkpoints/:cid/restore", h((req, res) => {
    requireProjectDir(req.params.id);
    const paths = (req.body as { paths?: string[] })?.paths;
    const cp = checkpoints.restore(req.params.id, req.params.cid, paths);
    events.append(req.params.id, "iteration.created", { restored_from: req.params.cid, checkpoint_id: cp?.checkpoint_id ?? null }, { kind: "human", subject_id: req.owner?.email });
    res.json({ checkpoint: cp, restored_from: req.params.cid });
  }));

  // ------------------------------------------------------------------ 404 y errores
  app.use((_req, res) => {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "ruta no implementada" } });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
      res.status(err.status).json({ error: { code: err.code, message: err.message, details: err.details } });
      return;
    }
    const message = err instanceof Error ? err.message : String(err);
    log(`[bff] error: ${message}`);
    res.status(500).json({ error: { code: "INTERNAL", message } });
  });

  return {
    app,
    services: { agents, previews, checkpoints, events, runtime },
    async shutdown() {
      await previews.stopAll();
      await agents.closeAll();
    },
  };
}

function listAssets(dir: string, baseUrl: string): AssetInfo[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && !d.name.startsWith("."))
    .map((d) => {
      const file = path.join(dir, d.name);
      return { name: d.name, size_bytes: fs.statSync(file).size, mime_type: mimeFor(file), url: `${baseUrl}/${encodeURIComponent(d.name)}` };
    });
}

function safeAssetName(name: string): string {
  const safe = path.basename(name).replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  if (!safe || safe.startsWith(".")) throw new HttpError(400, "BAD_ASSET_NAME", "nombre de asset inválido");
  return safe;
}

function mimeFor(file: string): string {
  const ext = path.extname(file).toLowerCase();
  return (
    {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".json": "application/json",
      ".txt": "text/plain",
    } as Record<string, string>
  )[ext] ?? "application/octet-stream";
}
