import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { Checkpoint, CheckpointDiff } from "@wika-studio/wika-client";

export interface CheckpointMeta {
  agent_id?: string;
  model_id?: string;
  run_id?: string;
  kind?: "run" | "manual" | "restore" | "bootstrap";
}

/**
 * Checkpoints = commits git en el repo `proyectos` acotados a `app/{p}/`
 * (docs/studio-api-contract.md → Checkpoints). Nunca reescribe historial.
 */
export class CheckpointService {
  private identityChecked = false;
  private identityArgs: string[] = [];

  constructor(private readonly proyectosRoot: string) {}

  private rel(projectId: string): string {
    return path.posix.join("app", projectId);
  }

  ensureRepo(): void {
    fs.mkdirSync(this.proyectosRoot, { recursive: true });
    if (!fs.existsSync(path.join(this.proyectosRoot, ".git"))) {
      this.git(["init", "-q"]);
      const ignore = path.join(this.proyectosRoot, ".gitignore");
      if (!fs.existsSync(ignore)) {
        fs.writeFileSync(ignore, "node_modules/\n.expo/\n.wika/logs/\ndist/\n*.log\n");
      }
    }
    if (!this.identityChecked) {
      this.identityChecked = true;
      const name = this.gitSafe(["config", "user.name"]);
      const email = this.gitSafe(["config", "user.email"]);
      if (!name || !email) {
        this.identityArgs = ["-c", "user.name=WIKA Studio", "-c", "user.email=studio@wika.local"];
      }
    }
  }

  hasHead(): boolean {
    return this.gitSafe(["rev-parse", "--verify", "HEAD"]) !== null;
  }

  /** Rutas cambiadas (relativas al proyecto, separador `/`) respecto a HEAD. */
  changedFiles(projectId: string): string[] {
    this.ensureRepo();
    const out = this.git(["status", "--porcelain=v1", "-z", "--untracked-files=all", "--", this.rel(projectId)]);
    const entries = out.split("\0").filter(Boolean);
    const files: string[] = [];
    const prefix = `${this.rel(projectId)}/`;
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const status = entry.slice(0, 2);
      const file = entry.slice(3);
      if (status.startsWith("R") || status.startsWith("C")) i++; // la siguiente entrada es el origen del rename
      if (file.startsWith(prefix)) files.push(file.slice(prefix.length));
    }
    return files.filter((f) => !f.startsWith(".wika/logs/"));
  }

  /** Contenido actual de los documentos que vigila GateGuard (idea/, audits/). */
  snapshotDocs(projectId: string): Map<string, string | null> {
    const base = path.join(this.proyectosRoot, "app", projectId);
    const map = new Map<string, string | null>();
    for (const sub of ["idea", "audits"]) {
      const dir = path.join(base, sub);
      if (!fs.existsSync(dir)) continue;
      for (const f of fs.readdirSync(dir)) {
        if (!f.endsWith(".md")) continue;
        map.set(`${sub}/${f}`, fs.readFileSync(path.join(dir, f), "utf8"));
      }
    }
    return map;
  }

  readProjectFile(projectId: string, relPath: string): string | null {
    const file = path.join(this.proyectosRoot, "app", projectId, relPath);
    return fs.existsSync(file) && fs.statSync(file).isFile() ? fs.readFileSync(file, "utf8") : null;
  }

  /** Restaura rutas al estado de HEAD (o las borra si no existían). */
  revertPaths(projectId: string, relPaths: string[]): void {
    this.ensureRepo();
    for (const rel of relPaths) {
      const full = path.posix.join(this.rel(projectId), rel);
      const tracked = this.hasHead() && this.gitSafe(["cat-file", "-e", `HEAD:${full}`]) !== null;
      if (tracked) {
        this.git(["checkout", "HEAD", "--", full]);
      } else {
        const abs = path.join(this.proyectosRoot, full);
        if (fs.existsSync(abs)) fs.rmSync(abs, { recursive: true, force: true });
      }
    }
  }

  /** Crea un commit con los cambios de `app/{p}`; null si no hay cambios. */
  commit(projectId: string, summary: string, meta: CheckpointMeta = {}): Checkpoint | null {
    this.ensureRepo();
    this.git(["add", "-A", "--", this.rel(projectId)]);
    const staged = this.gitSafe(["diff", "--cached", "--quiet", "--", this.rel(projectId)]);
    if (staged !== null) return null; // exit 0 → sin cambios
    const trailers = [
      `WIKA-Kind: ${meta.kind ?? "manual"}`,
      meta.agent_id ? `WIKA-Agent: ${meta.agent_id}` : null,
      meta.model_id ? `WIKA-Model: ${meta.model_id}` : null,
      meta.run_id ? `WIKA-Run: ${meta.run_id}` : null,
    ].filter(Boolean) as string[];
    const message = `${summary.slice(0, 120)}\n\n${trailers.join("\n")}\n`;
    this.git([...this.identityArgs, "commit", "-q", "-m", message, "--", this.rel(projectId)]);
    const sha = this.git(["rev-parse", "HEAD"]).trim();
    return this.list(projectId, 1).find((c) => c.checkpoint_id === sha) ?? {
      checkpoint_id: sha,
      created_at: new Date().toISOString(),
      summary,
      files_changed: 0,
      agent_id: meta.agent_id,
      model_id: meta.model_id,
    };
  }

  list(projectId: string, limit = 50): Checkpoint[] {
    this.ensureRepo();
    if (!this.hasHead()) return [];
    const out = this.git([
      "log",
      `--max-count=${limit}`,
      "--format=%x1e%H%x1f%aI%x1f%s%x1f%b%x1f",
      "--name-only",
      "--",
      this.rel(projectId),
    ]);
    const checkpoints: Checkpoint[] = [];
    for (const record of out.split("\x1e").filter((r) => r.trim())) {
      const [sha, date, subject, body, names] = record.split("\x1f");
      const files = (names ?? "").split("\n").filter((l) => l.trim());
      const trailers = parseTrailers(body ?? "");
      checkpoints.push({
        checkpoint_id: sha.trim(),
        created_at: date,
        summary: subject,
        files_changed: files.length,
        agent_id: trailers["WIKA-Agent"],
        model_id: trailers["WIKA-Model"],
      });
    }
    return checkpoints;
  }

  diff(projectId: string, checkpointId: string): CheckpointDiff {
    this.ensureRepo();
    assertSha(checkpointId);
    const stat = this.git(["show", "--stat", "--format=", checkpointId, "--", this.rel(projectId)]);
    const files = this.git(["show", "--name-only", "--format=", checkpointId, "--", this.rel(projectId)])
      .split("\n")
      .filter(Boolean)
      .map((f) => f.replace(`${this.rel(projectId)}/`, ""));
    return { checkpoint_id: checkpointId, stat, files };
  }

  /** Restaura `paths` (relativos al proyecto) al estado del checkpoint y commitea. */
  restore(projectId: string, checkpointId: string, paths?: string[]): Checkpoint | null {
    this.ensureRepo();
    assertSha(checkpointId);
    const targets = (paths && paths.length ? paths : ["."]).map((p) => path.posix.normalize(path.posix.join(this.rel(projectId), p)));
    for (const t of targets) {
      if (!t.startsWith(this.rel(projectId))) throw new Error("ruta fuera del proyecto");
      // Borra el estado actual de la ruta para que los archivos eliminados en el checkpoint también desaparezcan.
      const abs = path.join(this.proyectosRoot, t);
      if (fs.existsSync(abs)) {
        for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
          if ([".wika", "node_modules", ".expo"].includes(entry.name)) continue;
          fs.rmSync(path.join(abs, entry.name), { recursive: true, force: true });
        }
      }
      this.git(["checkout", checkpointId, "--", t]);
    }
    return this.commit(projectId, `restore ${checkpointId.slice(0, 7)}`, { kind: "restore" });
  }

  // -------------------------------------------------------------------------

  private git(args: string[]): string {
    return execFileSync("git", args, { cwd: this.proyectosRoot, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  }

  private gitSafe(args: string[]): string | null {
    const r = spawnSync("git", args, { cwd: this.proyectosRoot, encoding: "utf8" });
    return r.status === 0 ? r.stdout.trim() : null;
  }
}

function parseTrailers(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of body.split("\n")) {
    const m = line.match(/^(WIKA-[A-Za-z]+):\s*(.+)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

function assertSha(value: string): void {
  if (!/^[0-9a-f]{7,40}$/i.test(value)) throw new Error("checkpoint_id inválido");
}
