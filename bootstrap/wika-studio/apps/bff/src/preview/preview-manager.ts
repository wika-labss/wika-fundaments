import { type ChildProcess, spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import type { PreviewState, PreviewStatus } from "@wika-studio/wika-client";

export interface PreviewManagerOptions {
  portRange: [number, number];
  /** Comando usado para instalar dependencias y correr scripts. */
  npmCommand?: string;
  /** Tiempo máximo de espera por `PREVIEW_URL=` antes de marcar error. */
  readyTimeoutMs?: number;
  /** Para pruebas: comando alternativo que arranca el dev server. */
  devCommand?: (iterationDir: string, port: number) => { command: string; args: string[] };
  log?: (msg: string) => void;
}

interface PreviewEntry {
  key: string;
  projectId: string;
  iteration: string;
  dir: string;
  status: PreviewStatus;
  port?: number;
  previewUrl?: string;
  startedAt?: string;
  lastError?: string;
  child?: ChildProcess;
  logStream?: fs.WriteStream;
  recentLines: string[];
  readyTimer?: NodeJS.Timeout;
}

const MAX_RECENT = 400;

/**
 * Levanta y supervisa el dev server de una iteración según
 * docs/iteration-environment-spec.md: `node scripts/wika-dev.mjs` con PORT
 * asignado; captura stdout/stderr en `.wika/logs/dev.log` y detecta la línea
 * `PREVIEW_URL=`.
 */
export class PreviewManager {
  private readonly entries = new Map<string, PreviewEntry>();
  private readonly npm: string;
  private readonly readyTimeoutMs: number;

  constructor(private readonly options: PreviewManagerOptions) {
    this.npm = options.npmCommand ?? (process.platform === "win32" ? "npm.cmd" : "npm");
    this.readyTimeoutMs = options.readyTimeoutMs ?? 240_000;
  }

  private key(projectId: string, iteration: string): string {
    return `${projectId}/${iteration}`;
  }

  get(projectId: string, iteration: string): PreviewState {
    const e = this.entries.get(this.key(projectId, iteration));
    if (!e) return { project_id: projectId, iteration, status: "stopped" };
    return this.toState(e);
  }

  logs(projectId: string, iteration: string, limit = 200): string[] {
    const e = this.entries.get(this.key(projectId, iteration));
    if (e) return e.recentLines.slice(-limit);
    return [];
  }

  async start(projectId: string, iteration: string, iterationDir: string): Promise<PreviewState> {
    const key = this.key(projectId, iteration);
    const existing = this.entries.get(key);
    if (existing && existing.status !== "stopped" && existing.status !== "error") {
      return this.toState(existing);
    }
    if (!fs.existsSync(path.join(iterationDir, "package.json"))) {
      throw new Error(`La iteración ${iteration} no tiene package.json; crea el prototipo primero`);
    }
    const entry: PreviewEntry = {
      key,
      projectId,
      iteration,
      dir: iterationDir,
      status: "installing",
      recentLines: [],
    };
    this.entries.set(key, entry);
    this.openLog(entry);

    void this.run(entry).catch((err: Error) => {
      this.fail(entry, err.message);
    });
    return this.toState(entry);
  }

  async stop(projectId: string, iteration: string): Promise<PreviewState> {
    const key = this.key(projectId, iteration);
    const e = this.entries.get(key);
    if (!e) return { project_id: projectId, iteration, status: "stopped" };
    await this.kill(e);
    e.status = "stopped";
    e.previewUrl = undefined;
    e.port = undefined;
    this.appendLine(e, "[studio] preview detenido");
    return this.toState(e);
  }

  async stopAll(): Promise<void> {
    await Promise.all([...this.entries.values()].map((e) => this.kill(e)));
  }

  // -------------------------------------------------------------------------

  private async run(entry: PreviewEntry): Promise<void> {
    if (!fs.existsSync(path.join(entry.dir, "node_modules"))) {
      this.appendLine(entry, "[studio] instalando dependencias (npm install)…");
      await this.exec(entry, this.npm, ["install", "--no-audit", "--no-fund"]);
    }
    const port = await this.allocatePort();
    entry.port = port;
    entry.status = "starting";
    entry.startedAt = new Date().toISOString();
    this.appendLine(entry, `[studio] iniciando dev server en puerto ${port}`);

    const cmd = this.options.devCommand
      ? this.options.devCommand(entry.dir, port)
      : { command: process.execPath, args: [path.join("scripts", "wika-dev.mjs")] };

    const child = spawn(cmd.command, cmd.args, {
      cwd: entry.dir,
      env: {
        ...process.env,
        PORT: String(port),
        BROWSER: "none",
        CI: "1",
        EXPO_NO_TELEMETRY: "1",
        FORCE_COLOR: "0",
      },
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32" && cmd.command.endsWith(".cmd"),
    });
    entry.child = child;

    const onData = (buf: Buffer) => {
      for (const line of buf.toString("utf8").split(/\r?\n/)) {
        if (!line) continue;
        this.appendLine(entry, line);
        const m = line.match(/PREVIEW_URL=(\S+)/);
        if (m && entry.status === "starting") {
          entry.previewUrl = m[1];
          entry.status = "ready";
          if (entry.readyTimer) clearTimeout(entry.readyTimer);
          this.appendLine(entry, `[studio] preview listo: ${entry.previewUrl}`);
        }
      }
    };
    child.stdout?.on("data", onData);
    child.stderr?.on("data", onData);
    child.on("exit", (code, signal) => {
      if (entry.readyTimer) clearTimeout(entry.readyTimer);
      if (entry.status !== "stopped") {
        this.fail(entry, `dev server terminó (code=${code ?? "null"}, signal=${signal ?? "none"})`);
      }
      entry.child = undefined;
    });
    child.on("error", (err) => this.fail(entry, err.message));

    entry.readyTimer = setTimeout(() => {
      if (entry.status === "starting") {
        this.fail(entry, "el dev server no reportó PREVIEW_URL a tiempo");
        void this.kill(entry);
      }
    }, this.readyTimeoutMs);
  }

  private exec(entry: PreviewEntry, command: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: entry.dir,
        env: { ...process.env, CI: "1", FORCE_COLOR: "0" },
        stdio: ["ignore", "pipe", "pipe"],
        shell: process.platform === "win32",
      });
      entry.child = child;
      const onData = (buf: Buffer) => {
        for (const line of buf.toString("utf8").split(/\r?\n/)) if (line) this.appendLine(entry, line);
      };
      child.stdout?.on("data", onData);
      child.stderr?.on("data", onData);
      child.on("error", reject);
      child.on("exit", (code) => {
        entry.child = undefined;
        if (code === 0) resolve();
        else reject(new Error(`${command} ${args.join(" ")} falló con código ${code}`));
      });
    });
  }

  private fail(entry: PreviewEntry, message: string): void {
    entry.status = "error";
    entry.lastError = message;
    entry.previewUrl = undefined;
    this.appendLine(entry, `[studio] error: ${message}`);
  }

  private async kill(entry: PreviewEntry): Promise<void> {
    const child = entry.child;
    if (entry.readyTimer) clearTimeout(entry.readyTimer);
    if (!child || child.exitCode !== null) return;
    await new Promise<void>((resolve) => {
      const timer = setTimeout(() => {
        try {
          child.kill("SIGKILL");
        } catch {
          /* ya terminó */
        }
        resolve();
      }, 5000);
      child.once("exit", () => {
        clearTimeout(timer);
        resolve();
      });
      if (process.platform === "win32" && child.pid) {
        spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
      } else {
        child.kill("SIGTERM");
      }
    });
  }

  private openLog(entry: PreviewEntry): void {
    const logDir = path.join(entry.dir, ".wika", "logs");
    fs.mkdirSync(logDir, { recursive: true });
    entry.logStream?.end();
    entry.logStream = fs.createWriteStream(path.join(logDir, "dev.log"), { flags: "a" });
    entry.logStream.write(`\n--- ${new Date().toISOString()} start ---\n`);
  }

  private appendLine(entry: PreviewEntry, line: string): void {
    entry.recentLines.push(line);
    if (entry.recentLines.length > MAX_RECENT) entry.recentLines.splice(0, entry.recentLines.length - MAX_RECENT);
    entry.logStream?.write(`${line}\n`);
    this.options.log?.(`[preview ${entry.key}] ${line}`);
  }

  private usedPorts(): Set<number> {
    const used = new Set<number>();
    for (const e of this.entries.values()) if (e.port && e.status !== "stopped" && e.status !== "error") used.add(e.port);
    return used;
  }

  private async allocatePort(): Promise<number> {
    const [from, to] = this.options.portRange;
    const used = this.usedPorts();
    for (let p = from; p <= to; p++) {
      if (used.has(p)) continue;
      if (await isPortFree(p)) return p;
    }
    throw new Error(`No hay puertos libres en el rango ${from}-${to}`);
  }

  private toState(e: PreviewEntry): PreviewState {
    return {
      project_id: e.projectId,
      iteration: e.iteration,
      status: e.status,
      preview_url: e.previewUrl,
      port: e.port,
      started_at: e.startedAt,
      last_error: e.lastError,
    };
  }
}

export function isPortFree(port: number, host = "127.0.0.1"): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once("error", () => resolve(false));
    server.listen({ port, host }, () => {
      server.close(() => resolve(true));
    });
  });
}
