import fs from "node:fs";
import path from "node:path";
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

export const MOCK_MODELS: ModelInfo[] = [
  { id: "mock-fast", display_name: "Mock rápido", description: "Runtime simulado (sin IA). Solo desarrollo." },
  { id: "mock-careful", display_name: "Mock cuidadoso", description: "Runtime simulado (sin IA). Solo desarrollo." },
];

/** Marcador en las plantillas donde el mock inserta elementos nuevos. */
export const SLOT_MARKER = "{/* wika:slot */}";

/**
 * Runtime simulado (docs/agent-orchestration.md → modo `mock`): emite los
 * mismos eventos que el SDK y realiza ediciones deterministas para probar
 * Studio sin API key. Nunca usar en producción.
 */
export class MockRuntime implements AgentRuntime {
  readonly kind = "mock" as const;

  constructor(private readonly delayMs = 60) {}

  async listModels(): Promise<ModelInfo[]> {
    return MOCK_MODELS;
  }

  async openSession(options: OpenSessionOptions): Promise<RuntimeSession> {
    const delay = this.delayMs;
    return {
      async send(message: RuntimeMessage, modelId: string, handlers: RuntimeHandlers): Promise<RuntimeRun> {
        let cancelled = false;
        const started = Date.now();
        const done: Promise<RuntimeRunResult> = (async () => {
          const edits = planEdits(options, ownerMessage(message.text));
          const reply: string[] = [`(${modelId}) Entendido. Trabajo en \`${path.basename(options.cwd)}\`.`];
          for (const edit of edits) {
            if (cancelled) return { status: "cancelled" as const, durationMs: Date.now() - started };
            const rel = edit.relPath.replaceAll("\\", "/");
            handlers.onToolCall({ callId: `mock-${Math.random().toString(36).slice(2, 8)}`, name: "edit", status: "running", path: rel });
            await sleep(delay);
            edit.apply();
            handlers.onToolCall({ callId: `mock-${Math.random().toString(36).slice(2, 8)}`, name: "edit", status: "completed", path: rel });
            reply.push(`- ${edit.description} (\`${rel}\`)`);
          }
          if (edits.length === 0) reply.push("No encontré un archivo editable para esa instrucción en el mock.");
          const text = reply.join("\n");
          for (const chunk of text.match(/.{1,24}/gs) ?? []) {
            if (cancelled) break;
            handlers.onDelta(chunk);
            await sleep(delay / 4);
          }
          handlers.onMessage(text);
          return {
            status: cancelled ? ("cancelled" as const) : ("succeeded" as const),
            text,
            durationMs: Date.now() - started,
            usage: { input_tokens: message.text.length, output_tokens: text.length, total_tokens: message.text.length + text.length },
          };
        })();
        return {
          cancel: async () => {
            cancelled = true;
          },
          done,
        };
      },
      async close() {
        /* nada que liberar */
      },
    };
  }
}

interface PlannedEdit {
  relPath: string;
  description: string;
  apply: () => void;
}

function ownerMessage(text: string): string {
  const m = text.match(/# Mensaje del dueño\n\n([\s\S]*?)(?:\n\n---|$)/);
  return (m ? m[1] : text).trim();
}

function planEdits(options: OpenSessionOptions, text: string): PlannedEdit[] {
  const lower = text.toLowerCase();
  const edits: PlannedEdit[] = [];
  const cwd = options.cwd;

  // Gancho de prueba: provoca violaciones que GateGuard debe revertir.
  if (lower.includes("[[violar]]")) {
    const projectRoot = findProjectRoot(cwd);
    if (projectRoot) {
      const build = path.join(projectRoot, "idea", "05-build-plan.md");
      edits.push({
        relPath: path.relative(cwd, build),
        description: "activa ready_for_construction (violación intencional)",
        apply: () => {
          if (!fs.existsSync(build)) return;
          const content = fs.readFileSync(build, "utf8").replace("ready_for_construction: false", "ready_for_construction: true");
          fs.writeFileSync(build, content);
        },
      });
      const hack = path.join(projectRoot, "final", "hack.txt");
      edits.push({
        relPath: path.relative(cwd, hack),
        description: "escribe fuera de la ruta permitida (violación intencional)",
        apply: () => {
          fs.mkdirSync(path.dirname(hack), { recursive: true });
          fs.writeFileSync(hack, "no permitido\n");
        },
      });
    }
  }

  const screen = findScreen(cwd);
  if (screen) {
    const isExpo = screen.endsWith(path.join("app", "index.tsx"));
    if (/bot[oó]n|button/.test(lower)) {
      const label = extractQuoted(text) ?? extractAfter(text, /(?:texto|label|dice|diga)\s+/i) ?? "Acción";
      const variant = /rojo|peligro|danger|eliminar/.test(lower) ? "danger" : /secundario|secondary|gris/.test(lower) ? "secondary" : "primary";
      const icon = /carrito|cart/.test(lower) ? "🛒" : /estrella|star/.test(lower) ? "★" : /coraz[oó]n|heart/.test(lower) ? "♥" : null;
      edits.push({
        relPath: path.relative(cwd, screen),
        description: `agrega botón "${label}" (${variant}${icon ? `, ícono ${icon}` : ""})`,
        apply: () => insertAtSlot(screen, buttonSnippet(label, variant, icon, isExpo)),
      });
    } else if (/t[ií]tulo|texto|title|heading|letra/.test(lower)) {
      const content = extractQuoted(text) ?? extractAfter(text, /(?:diga|dice|texto)\s+/i) ?? "Nuevo texto";
      edits.push({
        relPath: path.relative(cwd, screen),
        description: `agrega texto "${content}"`,
        apply: () => insertAtSlot(screen, textSnippet(content, isExpo)),
      });
    } else if (/imagen|image|logo/.test(lower)) {
      const asset = firstAsset(cwd);
      edits.push({
        relPath: path.relative(cwd, screen),
        description: asset ? `muestra la imagen ${asset}` : "agrega un placeholder de imagen",
        apply: () => insertAtSlot(screen, imageSnippet(asset, isExpo)),
      });
    } else if (options.name.includes("wika-builder") || options.name.includes("wika-refiner")) {
      edits.push({
        relPath: path.relative(cwd, screen),
        description: "agrega una nota visible con la instrucción",
        apply: () => insertAtSlot(screen, textSnippet(text.slice(0, 60), isExpo)),
      });
    }
  }

  if (edits.length === 0) {
    const doc = firstMarkdown(cwd);
    if (doc) {
      edits.push({
        relPath: path.relative(cwd, doc),
        description: "agrega sección de notas",
        apply: () => fs.appendFileSync(doc, `\n\n## Notas (${new Date().toISOString().slice(0, 10)})\n\n${text.trim()}\n`),
      });
    }
  }
  return edits;
}

function findProjectRoot(cwd: string): string | null {
  let dir = cwd;
  for (let i = 0; i < 4; i++) {
    if (fs.existsSync(path.join(dir, "idea")) && fs.existsSync(path.join(dir, "iterations"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function findScreen(cwd: string): string | null {
  for (const candidate of [path.join(cwd, "src", "App.tsx"), path.join(cwd, "app", "index.tsx")]) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function firstMarkdown(cwd: string): string | null {
  if (!fs.existsSync(cwd)) return null;
  const direct = fs.readdirSync(cwd).filter((f) => f.endsWith(".md")).sort();
  if (direct.length) return path.join(cwd, direct[0]);
  return null;
}

function firstAsset(cwd: string): string | null {
  const dir = path.join(cwd, "assets");
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|svg|webp|gif)$/i.test(f)).sort();
  return files[0] ?? null;
}

function extractQuoted(text: string): string | null {
  const m = text.match(/["“”']([^"“”']{1,60})["“”']/);
  return m ? m[1] : null;
}

function extractAfter(text: string, re: RegExp): string | null {
  const m = text.match(re);
  if (!m || m.index === undefined) return null;
  const rest = text.slice(m.index + m[0].length).split(/[,.;\n]| y /)[0]?.trim();
  return rest ? rest.slice(0, 60) : null;
}

function insertAtSlot(file: string, snippet: string): void {
  const content = fs.readFileSync(file, "utf8");
  if (content.includes(SLOT_MARKER)) {
    fs.writeFileSync(file, content.replace(SLOT_MARKER, `${snippet}\n        ${SLOT_MARKER}`));
    return;
  }
  const idx = content.lastIndexOf("</section>");
  const idx2 = idx === -1 ? content.lastIndexOf("</View>") : idx;
  if (idx2 === -1) {
    fs.appendFileSync(file, `\n// ${snippet}\n`);
    return;
  }
  fs.writeFileSync(file, `${content.slice(0, idx2)}${snippet}\n      ${content.slice(idx2)}`);
}

function buttonSnippet(label: string, variant: string, icon: string | null, expo: boolean): string {
  const iconProp = icon ? (expo ? ` icon={<Text>${icon}</Text>}` : ` icon={<span aria-hidden>${icon}</span>}`) : "";
  return `<Button label=${JSON.stringify(label)} variant="${variant}"${iconProp} />`;
}

function textSnippet(content: string, expo: boolean): string {
  return expo
    ? `<Text style={{ color: theme.colors.text, fontSize: theme.fontSize.lg }}>${escapeJsx(content)}</Text>`
    : `<p style={{ color: theme.colors.text, fontSize: theme.fontSize.lg, margin: 0 }}>${escapeJsx(content)}</p>`;
}

function imageSnippet(asset: string | null, expo: boolean): string {
  if (!asset) {
    return expo
      ? `<View style={{ width: 120, height: 120, borderRadius: theme.radius.md, backgroundColor: theme.colors.border }} />`
      : `<div style={{ width: 120, height: 120, borderRadius: theme.radius.md, background: theme.colors.border }} />`;
  }
  return expo
    ? `<Image source={require(${JSON.stringify(`../assets/${asset}`)})} style={{ width: 120, height: 120, borderRadius: theme.radius.md }} />`
    : `<img src={${JSON.stringify(`/${asset}`)}} alt="" style={{ width: 120, height: 120, borderRadius: theme.radius.md, objectFit: "cover" }} />`;
}

function escapeJsx(text: string): string {
  return text.replace(/[{}<>]/g, "");
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
