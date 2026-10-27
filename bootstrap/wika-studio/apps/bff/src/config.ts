import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Raíz del monorepo wika-studio (apps/bff/src → ../../..). */
export function getStudioRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
}

export type RuntimeKind = "cursor-sdk" | "mock";

export interface StudioConfig {
  host: string;
  port: number;
  webOrigin: string;
  /** Raíz del repo `proyectos` (contiene app/). */
  proyectosRoot: string;
  /** Raíz del clon de wika-fundaments (agents/, .cursorrules, templates/). */
  fundamentsRoot: string | null;
  /** Carpeta de estado del Studio (settings, sesiones, estado del SDK). */
  dataDir: string;
  /** Plantillas de iteración. */
  templatesDir: string;
  owners: string[];
  passwordHash: string | null;
  sessionSecret: string;
  sessionTtlMs: number;
  cursorApiKey: string | null;
  runtime: RuntimeKind;
  previewPortRange: [number, number];
  maxPromptDocChars: number;
}

function parseList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function parseRange(value: string | undefined, fallback: [number, number]): [number, number] {
  if (!value) return fallback;
  const m = value.match(/^(\d+)\s*-\s*(\d+)$/);
  if (!m) return fallback;
  const a = Number(m[1]);
  const b = Number(m[2]);
  return a < b ? [a, b] : fallback;
}

/** Carga `.env` de la raíz del monorepo sin dependencias externas. */
export function loadDotEnv(root = getStudioRoot()): void {
  const file = path.join(root, ".env");
  if (!fs.existsSync(file)) return;
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): StudioConfig {
  const studioRoot = getStudioRoot();
  const cursorApiKey = env.CURSOR_API_KEY?.trim() || null;
  const requestedRuntime = (env.STUDIO_AGENT_RUNTIME ?? "").trim().toLowerCase();
  let runtime: RuntimeKind;
  if (requestedRuntime === "mock") runtime = "mock";
  else if (requestedRuntime === "cursor-sdk") runtime = "cursor-sdk";
  else runtime = cursorApiKey ? "cursor-sdk" : "mock";

  const dataDir = env.STUDIO_DATA_DIR ? path.resolve(env.STUDIO_DATA_DIR) : path.join(studioRoot, ".data");
  const sessionSecretFile = path.join(dataDir, "session-secret");
  let sessionSecret = env.STUDIO_SESSION_SECRET?.trim() ?? "";
  if (!sessionSecret) {
    fs.mkdirSync(dataDir, { recursive: true });
    if (fs.existsSync(sessionSecretFile)) {
      sessionSecret = fs.readFileSync(sessionSecretFile, "utf8").trim();
    } else {
      sessionSecret = crypto.randomBytes(32).toString("hex");
      fs.writeFileSync(sessionSecretFile, sessionSecret, { mode: 0o600 });
    }
  }

  return {
    host: env.HOST?.trim() || "127.0.0.1",
    port: Number(env.PORT ?? 3001),
    webOrigin: env.STUDIO_WEB_ORIGIN?.trim() || "http://localhost:5173",
    proyectosRoot: env.WIKA_PROYECTOS_ROOT
      ? path.resolve(env.WIKA_PROYECTOS_ROOT)
      : path.join(studioRoot, "fixtures", "proyectos"),
    fundamentsRoot: env.WIKA_FUNDAMENTS_ROOT ? path.resolve(env.WIKA_FUNDAMENTS_ROOT) : detectFundaments(studioRoot),
    dataDir,
    templatesDir: path.join(studioRoot, "templates"),
    owners: parseList(env.STUDIO_OWNERS),
    passwordHash: env.STUDIO_PASSWORD_HASH?.trim() || null,
    sessionSecret,
    sessionTtlMs: Number(env.STUDIO_SESSION_TTL_HOURS ?? 12) * 3600 * 1000,
    cursorApiKey,
    runtime,
    previewPortRange: parseRange(env.STUDIO_PREVIEW_PORTS, [4300, 4399]),
    maxPromptDocChars: Number(env.STUDIO_MAX_PROMPT_DOC_CHARS ?? 12000),
  };
}

/** Busca un clon de wika-fundaments junto al monorepo o conteniéndolo (bootstrap/). */
function detectFundaments(studioRoot: string): string | null {
  const candidates = [
    path.resolve(studioRoot, "..", "wika-fundaments"),
    path.resolve(studioRoot, "..", ".."), // bootstrap/wika-studio dentro de fundaments
    path.resolve(studioRoot, ".."),
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, ".cursorrules")) && fs.existsSync(path.join(c, "agents", "README.md"))) {
      return c;
    }
  }
  return null;
}

let cached: StudioConfig | null = null;

export function getConfig(): StudioConfig {
  if (!cached) {
    loadDotEnv();
    cached = loadConfig();
  }
  return cached;
}

/** Solo para pruebas. */
export function resetConfigForTests(next?: StudioConfig): void {
  cached = next ?? null;
}
