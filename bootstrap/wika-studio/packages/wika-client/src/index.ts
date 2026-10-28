/** Tipos alineados a wika-fundaments docs/studio-api-contract.md (v1.1.0) */

export type ProjectMode = "exploration" | "construction";
export type SolutionType = "mobile_app" | "game" | "web_app" | "hybrid";

export interface ProjectSummary {
  project_id: string;
  path: string;
  mode?: ProjectMode;
  solution_type?: SolutionType;
}

export interface ProjectFlags {
  audit_1_passed?: boolean;
  audit_2_passed?: boolean;
  visual_approval_passed?: boolean;
  audit_3_passed?: boolean;
  ready_for_construction?: boolean;
  project_mode?: ProjectMode;
  solution_type?: SolutionType;
}

export interface ProjectState {
  project_id: string;
  state_id: string;
  suggested_agent: string;
  mode: ProjectMode;
  flags: ProjectFlags;
  iterations?: string[];
}

export interface ValidateResult {
  ok: boolean;
  findings: Array<{ path: string; message: string; severity?: string }>;
}

export interface ApiError {
  error: { code: string; message: string; details?: unknown };
}

// ---------------------------------------------------------------------------
// Auth (dueños)

export interface Owner {
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthMeResponse {
  owner: Owner;
}

// ---------------------------------------------------------------------------
// Modelos

export interface ModelInfo {
  id: string;
  display_name: string;
  description?: string;
}

export interface ModelsResponse {
  models: ModelInfo[];
  default_model_id: string | null;
  runtime: AgentRuntimeKind;
}

export type AgentRuntimeKind = "cursor-sdk" | "mock";

// ---------------------------------------------------------------------------
// Agentes y sesiones

export type AgentId =
  | "wika-bootstrap"
  | "wika-scribe"
  | "wika-auditor"
  | "wika-designer"
  | "wika-builder"
  | "wika-refiner"
  | "wika-packager";

export const CHAT_AGENTS: AgentId[] = [
  "wika-scribe",
  "wika-designer",
  "wika-builder",
  "wika-refiner",
  "wika-auditor",
];

export interface SessionSummary {
  session_id: string;
  project_id: string;
  agent_id: AgentId;
  model_id: string | null;
  iteration: string;
  allowed_paths: string[];
  created_at: string;
  active_run_id: string | null;
  message_count: number;
}

export interface SessionDetail extends SessionSummary {
  history: SessionEvent[];
}

export interface CreateSessionRequest {
  agent_id: AgentId;
  model_id?: string;
  iteration?: string;
}

export interface ImageAttachment {
  name: string;
  mime_type: string;
  data_base64: string;
}

export interface SendMessageRequest {
  text: string;
  model_id?: string;
  images?: ImageAttachment[];
}

export interface SendMessageResponse {
  run_id: string;
}

export type RunStatus = "succeeded" | "failed" | "cancelled";

export interface TokenUsageSummary {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}

export type SessionEvent =
  | { event: "user.message"; data: { run_id: string; text: string; image_names: string[]; at: string } }
  | {
      event: "run.started";
      data: { run_id: string; agent_id: AgentId; model_id: string; prompt_summary: string; at: string };
    }
  | { event: "assistant.delta"; data: { run_id: string; text: string } }
  | { event: "assistant.message"; data: { run_id: string; text: string; at: string } }
  | {
      event: "tool.call";
      data: { run_id: string; call_id: string; name: string; status: "running" | "completed" | "error"; path?: string };
    }
  | {
      event: "guard.violation";
      data: { run_id: string; path: string; reason: string; action: "reverted" };
    }
  | { event: "checkpoint.created"; data: { run_id: string; checkpoint_id: string; summary: string } }
  | {
      event: "run.finished";
      data: {
        run_id: string;
        status: RunStatus;
        usage?: TokenUsageSummary;
        duration_ms?: number;
        error?: string;
        at: string;
      };
    };

// ---------------------------------------------------------------------------
// Previews

export type PreviewStatus = "stopped" | "installing" | "starting" | "ready" | "error";

export interface PreviewState {
  project_id: string;
  iteration: string;
  status: PreviewStatus;
  preview_url?: string;
  port?: number;
  started_at?: string;
  last_error?: string;
}

export interface PreviewLogs {
  lines: string[];
}

// ---------------------------------------------------------------------------
// Assets

export interface AssetInfo {
  name: string;
  size_bytes: number;
  mime_type: string;
  url: string;
}

export interface UploadAssetRequest {
  name: string;
  mime_type: string;
  data_base64: string;
}

// ---------------------------------------------------------------------------
// Checkpoints

export interface Checkpoint {
  checkpoint_id: string;
  created_at: string;
  agent_id?: string;
  model_id?: string;
  summary: string;
  files_changed: number;
}

export interface CheckpointDiff {
  checkpoint_id: string;
  stat: string;
  files: string[];
}

export interface RestoreCheckpointRequest {
  paths?: string[];
}

// ---------------------------------------------------------------------------
// Eventos de auditoría (docs/audit-event-schema.md)

export type AuditEventType =
  | "project.created"
  | "document.updated"
  | "validation.run"
  | "job.started"
  | "job.completed"
  | "gate.approval_requested"
  | "gate.approved"
  | "gate.rejected"
  | "mode.promoted"
  | "iteration.created"
  | "release.submitted"
  | "demo.approved";

export interface AuditEvent {
  event_id: string;
  occurred_at: string;
  project_id: string;
  type: AuditEventType;
  actor: { kind: "human" | "ia" | "system"; role?: string; subject_id?: string };
  payload: Record<string, unknown>;
  correlation_id?: string;
}

// ---------------------------------------------------------------------------
// Bootstrap de proyecto

export interface CreateProjectRequest {
  project_id: string;
  title: string;
  project_mode: ProjectMode;
  solution_type: SolutionType;
  owner?: string;
  problem_statement?: string;
}

export interface CreateProjectResponse {
  project: ProjectSummary;
  created_files: string[];
}
