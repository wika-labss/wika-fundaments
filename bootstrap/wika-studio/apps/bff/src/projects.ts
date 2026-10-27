import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ProjectFlags, ProjectMode, ProjectSummary } from "@wika-studio/wika-client";

/** Raíz del monorepo wika-studio (apps/bff/src → ../../..). */
export function getStudioRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
}

export function getProyectosRoot(): string {
  const root = process.env.WIKA_PROYECTOS_ROOT;
  if (!root) {
    return path.join(getStudioRoot(), "fixtures", "proyectos");
  }
  return path.resolve(root);
}

export function listProjects(): ProjectSummary[] {
  const appDir = path.join(getProyectosRoot(), "app");
  if (!fs.existsSync(appDir)) {
    return [];
  }
  return fs
    .readdirSync(appDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({
      project_id: d.name,
      path: path.join(appDir, d.name),
    }));
}

function parseFrontmatter(text: string): Record<string, unknown> {
  if (!text.startsWith("---")) return {};
  const parts = text.split("---", 3);
  if (parts.length < 3) return {};
  const data: Record<string, unknown> = {};
  for (const line of parts[1].split("\n")) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (!m) continue;
    const [, key, raw] = m;
    if (raw === "true") data[key] = true;
    else if (raw === "false") data[key] = false;
    else data[key] = raw.replace(/^["']|["']$/g, "");
  }
  return data;
}

export function readProjectFlags(projectId: string): ProjectFlags {
  const idea = path.join(getProyectosRoot(), "app", projectId, "idea", "01-problem.md");
  const build = path.join(getProyectosRoot(), "app", projectId, "idea", "05-build-plan.md");
  const flags: ProjectFlags = {};
  if (fs.existsSync(idea)) {
    const m = parseFrontmatter(fs.readFileSync(idea, "utf8"));
    if (typeof m.project_mode === "string") {
      flags.project_mode = m.project_mode as ProjectMode;
    }
    if (typeof m.audit_1_passed === "boolean") flags.audit_1_passed = m.audit_1_passed;
  }
  if (fs.existsSync(build)) {
    const m = parseFrontmatter(fs.readFileSync(build, "utf8"));
    if (typeof m.audit_2_passed === "boolean") flags.audit_2_passed = m.audit_2_passed;
    if (typeof m.visual_approval_passed === "boolean") {
      flags.visual_approval_passed = m.visual_approval_passed;
    }
    if (typeof m.audit_3_passed === "boolean") flags.audit_3_passed = m.audit_3_passed;
    if (typeof m.ready_for_construction === "boolean") {
      flags.ready_for_construction = m.ready_for_construction;
    }
  }
  return flags;
}

export function resolveStateId(flags: ProjectFlags): string {
  if (flags.ready_for_construction) return "S09";
  if (flags.audit_3_passed === false && flags.visual_approval_passed) return "S08";
  if (flags.visual_approval_passed === false && flags.audit_2_passed) return "S06";
  if (flags.audit_2_passed === false && flags.audit_1_passed) return "S04";
  if (flags.audit_1_passed) return "S03";
  return "S01";
}

export function suggestedAgent(stateId: string): string {
  const map: Record<string, string> = {
    S01: "wika-scribe",
    S03: "wika-scribe",
    S04: "wika-auditor",
    S06: "wika-designer",
    S08: "wika-auditor",
    S09: "wika-builder",
  };
  return map[stateId] ?? "wika-bootstrap";
}

export function validateProjectStructure(projectId: string): {
  ok: boolean;
  findings: Array<{ path: string; message: string; severity: string }>;
} {
  const base = path.join(getProyectosRoot(), "app", projectId);
  const findings: Array<{ path: string; message: string; severity: string }> = [];
  if (!fs.existsSync(base)) {
    findings.push({ path: projectId, message: "proyecto no existe", severity: "error" });
    return { ok: false, findings };
  }
  for (const dir of ["idea", "audits", "iterations", "final"]) {
    if (!fs.existsSync(path.join(base, dir))) {
      findings.push({ path: projectId, message: `falta ${dir}/`, severity: "error" });
    }
  }
  const flags = readProjectFlags(projectId);
  if (flags.ready_for_construction && !flags.audit_1_passed) {
    findings.push({
      path: projectId,
      message: "ready_for_construction prematuro",
      severity: "error",
    });
  }
  return { ok: findings.every((f) => f.severity !== "error"), findings };
}
