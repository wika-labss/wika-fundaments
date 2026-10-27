import type { AgentRuntimeKind, ModelInfo, TokenUsageSummary } from "@wika-studio/wika-client";

export interface RuntimeImage {
  mimeType: string;
  dataBase64: string;
}

export interface RuntimeMessage {
  text: string;
  images?: RuntimeImage[];
}

export interface RuntimeHandlers {
  onDelta(text: string): void;
  onMessage(text: string): void;
  onToolCall(call: { callId: string; name: string; status: "running" | "completed" | "error"; path?: string }): void;
  onThinking?(text: string): void;
}

export interface RuntimeRunResult {
  status: "succeeded" | "failed" | "cancelled";
  text?: string;
  error?: string;
  usage?: TokenUsageSummary;
  durationMs?: number;
}

export interface RuntimeRun {
  cancel(): Promise<void>;
  done: Promise<RuntimeRunResult>;
}

export interface OpenSessionOptions {
  sessionId: string;
  /** Carpeta donde trabaja el agente (cwd del SDK). */
  cwd: string;
  /** Carpeta donde el SDK guarda su propio estado (transcripts). */
  stateDir: string;
  modelId: string;
  name: string;
  disallowedTools: string[];
}

export interface RuntimeSession {
  send(message: RuntimeMessage, modelId: string, handlers: RuntimeHandlers): Promise<RuntimeRun>;
  close(): Promise<void>;
}

export interface AgentRuntime {
  readonly kind: AgentRuntimeKind;
  listModels(): Promise<ModelInfo[]>;
  openSession(options: OpenSessionOptions): Promise<RuntimeSession>;
}
