import { Agent, Cursor, type SDKAgent, type SDKImage, type SDKMessage } from "@cursor/sdk";
import type { ModelInfo } from "@wika-studio/wika-client";
import type {
  AgentRuntime,
  OpenSessionOptions,
  RuntimeHandlers,
  RuntimeMessage,
  RuntimeRun,
  RuntimeRunResult,
  RuntimeSession,
} from "./runtime.js";

/**
 * Runtime oficial v1 (docs/agent-orchestration.md → Runtime de IA, modo local):
 * la IA de la cuenta Cursor de los dueños edita archivos del proyecto en disco.
 */
export class CursorSdkRuntime implements AgentRuntime {
  readonly kind = "cursor-sdk" as const;

  constructor(private readonly apiKey: string) {}

  async listModels(): Promise<ModelInfo[]> {
    const models = await Cursor.models.list({ apiKey: this.apiKey });
    return models.map((m) => ({ id: m.id, display_name: m.displayName, description: m.description }));
  }

  async openSession(options: OpenSessionOptions): Promise<RuntimeSession> {
    return new CursorSdkSession(this.apiKey, options);
  }
}

class CursorSdkSession implements RuntimeSession {
  private agent: SDKAgent | null = null;
  private agentId: string | null = null;

  constructor(
    private readonly apiKey: string,
    private readonly options: OpenSessionOptions,
  ) {}

  private async ensureAgent(modelId: string): Promise<SDKAgent> {
    if (this.agent) return this.agent;
    const common = {
      apiKey: this.apiKey,
      model: { id: modelId },
      name: this.options.name,
      disallowedTools: this.options.disallowedTools,
      local: { cwd: this.options.cwd, settingSources: ["project" as const] },
    };
    this.agent = this.agentId ? await Agent.resume(this.agentId, common) : await Agent.create(common);
    this.agentId = this.agent.agentId;
    return this.agent;
  }

  async send(message: RuntimeMessage, modelId: string, handlers: RuntimeHandlers): Promise<RuntimeRun> {
    const agent = await this.ensureAgent(modelId);
    const images: SDKImage[] | undefined = message.images?.map((img) => ({
      data: img.dataBase64,
      mimeType: img.mimeType,
    }));
    const started = Date.now();
    const run = await agent.send(
      { text: message.text, images },
      {
        model: { id: modelId },
        onDelta: ({ update }) => {
          if (update.type === "text-delta") handlers.onDelta(update.text);
        },
      },
    );

    const done: Promise<RuntimeRunResult> = (async () => {
      let lastAssistant = "";
      if (run.supports("stream")) {
        for await (const msg of run.stream()) {
          lastAssistant = consume(msg, handlers) ?? lastAssistant;
        }
      }
      const result = await run.wait();
      const text = result.result ?? lastAssistant;
      if (text && !lastAssistant) handlers.onMessage(text);
      return {
        status: result.status === "finished" ? "succeeded" : result.status === "cancelled" ? "cancelled" : "failed",
        text,
        error: result.error?.message,
        durationMs: result.durationMs ?? Date.now() - started,
        usage: result.usage
          ? {
              input_tokens: result.usage.inputTokens,
              output_tokens: result.usage.outputTokens,
              total_tokens: result.usage.totalTokens,
            }
          : undefined,
      };
    })();

    return {
      cancel: () => run.cancel(),
      done,
    };
  }

  async close(): Promise<void> {
    this.agent?.close();
    this.agent = null;
  }
}

function consume(msg: SDKMessage, handlers: RuntimeHandlers): string | undefined {
  switch (msg.type) {
    case "assistant": {
      const text = msg.message.content
        .filter((b): b is { type: "text"; text: string } => b.type === "text")
        .map((b) => b.text)
        .join("");
      if (text) handlers.onMessage(text);
      return text || undefined;
    }
    case "tool_call": {
      const args = (msg.args ?? {}) as Record<string, unknown>;
      const pathArg = typeof args.path === "string" ? args.path : typeof args.file_path === "string" ? args.file_path : undefined;
      handlers.onToolCall({ callId: msg.call_id, name: msg.name, status: msg.status, path: pathArg });
      return undefined;
    }
    case "thinking":
      handlers.onThinking?.(msg.text);
      return undefined;
    default:
      return undefined;
  }
}
