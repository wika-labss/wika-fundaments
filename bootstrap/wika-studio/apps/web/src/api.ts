import type {
  AssetInfo,
  AuditEvent,
  Checkpoint,
  CreateProjectRequest,
  CreateProjectResponse,
  CreateSessionRequest,
  ImageAttachment,
  ModelsResponse,
  Owner,
  PreviewState,
  ProjectState,
  ProjectSummary,
  SendMessageRequest,
  SessionDetail,
  SessionSummary,
  ValidateResult,
} from "@wika-studio/wika-client";

const api = "/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  const res = await fetch(`${api}${path}`, { credentials: "include", ...init, headers });
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const data = text ? (JSON.parse(text) as { error?: { code: string; message: string; details?: unknown } } & T) : ({} as T);
  if (!res.ok) {
    const err = (data as { error?: { code: string; message: string; details?: unknown } }).error;
    throw new ApiError(res.status, err?.code ?? "ERROR", err?.message ?? res.statusText, err?.details);
  }
  return data as T;
}

export const studioApi = {
  health: () => request<{ status: string; runtime: string; auth_configured: boolean }>("/health"),
  me: () => request<{ owner: Owner }>("/auth/me"),
  login: (email: string, password: string) =>
    request<{ owner: Owner }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request<void>("/auth/logout", { method: "POST" }),

  models: () => request<ModelsResponse>("/models"),
  setDefaultModel: (model_id: string) => request<{ default_model_id: string }>("/models/default", { method: "PUT", body: JSON.stringify({ model_id }) }),

  projects: () => request<{ projects: ProjectSummary[] }>("/projects"),
  createProject: (body: CreateProjectRequest) => request<CreateProjectResponse>("/projects", { method: "POST", body: JSON.stringify(body) }),
  state: (id: string) => request<ProjectState>(`/projects/${id}/state`),
  validate: (id: string) => request<ValidateResult>(`/projects/${id}/validate`, { method: "POST" }),
  events: (id: string) => request<{ events: AuditEvent[] }>(`/projects/${id}/events`),

  createSession: (id: string, body: CreateSessionRequest) =>
    request<SessionSummary>(`/projects/${id}/sessions`, { method: "POST", body: JSON.stringify(body) }),
  getSession: (id: string, sid: string) => request<SessionDetail>(`/projects/${id}/sessions/${sid}`),
  sendMessage: (id: string, sid: string, body: SendMessageRequest) =>
    request<{ run_id: string }>(`/projects/${id}/sessions/${sid}/messages`, { method: "POST", body: JSON.stringify(body) }),
  streamUrl: (id: string, sid: string) => `${api}/projects/${id}/sessions/${sid}/stream`,

  preview: (id: string, iteration: string) => request<PreviewState>(`/projects/${id}/iterations/${iteration}/preview`),
  startPreview: (id: string, iteration: string) =>
    request<PreviewState>(`/projects/${id}/iterations/${iteration}/preview/start`, { method: "POST" }),
  stopPreview: (id: string, iteration: string) =>
    request<PreviewState>(`/projects/${id}/iterations/${iteration}/preview/stop`, { method: "POST" }),

  assets: (id: string, iteration: string) => request<{ assets: AssetInfo[] }>(`/projects/${id}/iterations/${iteration}/assets`),
  uploadAsset: (id: string, iteration: string, file: ImageAttachment) =>
    request<AssetInfo>(`/projects/${id}/iterations/${iteration}/assets`, { method: "POST", body: JSON.stringify(file) }),

  checkpoints: (id: string) => request<{ checkpoints: Checkpoint[] }>(`/projects/${id}/checkpoints`),
  restore: (id: string, cid: string, paths?: string[]) =>
    request<{ checkpoint: Checkpoint | null; restored_from: string }>(`/projects/${id}/checkpoints/${cid}/restore`, {
      method: "POST",
      body: JSON.stringify({ paths }),
    }),
};

export function fileToAttachment(file: File): Promise<ImageAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("no se pudo leer el archivo"));
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const data = result.includes(",") ? result.split(",")[1] : result;
      resolve({ name: file.name, mime_type: file.type || "application/octet-stream", data_base64: data });
    };
    reader.readAsDataURL(file);
  });
}
