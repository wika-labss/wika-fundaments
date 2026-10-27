import fs from "node:fs";
import path from "node:path";
import type {
  ProjectFlags,
  ProjectMode,
  ProjectSummary,
  SolutionType,
  ValidateResult,
} from "@wika-studio/wika-client";
import { getConfig, getStudioRoot } from "./config.js";

export { getStudioRoot };

export function getProyectosRoot(): string {
  return getConfig().proyectosRoot;
}

const PROJECT_ID_RE = /^[a-z0-9][a-z0-9-]{1,63}$/;

export function isValidProjectId(id: string): boolean {
  return PROJECT_ID_RE.test(id);
}

export function projectDir(projectId: string): string {
  if (!isValidProjectId(projectId)) {
    throw new HttpError(400, "BAD_PROJECT_ID", "project_id debe ser kebab-case");
  }
  return path.join(getProyectosRoot(), "app", projectId);
}

export function requireProjectDir(projectId: string): string {
  const dir = projectDir(projectId);
  if (!fs.existsSync(dir)) {
    throw new HttpError(404, "PROJECT_NOT_FOUND", `proyecto ${projectId} no existe`);
  }
  return dir;
}

const ITERATION_RE = /^(prototype|v\d+)$/;

export function iterationDir(projectId: string, iteration: string): string {
  if (!ITERATION_RE.test(iteration)) {
    throw new HttpError(400, "BAD_ITERATION", "iteration debe ser prototype o vN");
  }
  return path.join(requireProjectDir(projectId), "iterations", iteration);
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export function listProjects(): ProjectSummary[] {
  const appDir = path.join(getProyectosRoot(), "app");
  if (!fs.existsSync(appDir)) {
    return [];
  }
  return fs
    .readdirSync(appDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && isValidProjectId(d.name))
    .map((d) => {
      const flags = readProjectFlags(d.name);
      return {
        project_id: d.name,
        path: path.join(appDir, d.name),
        mode: flags.project_mode ?? "construction",
        solution_type: flags.solution_type,
      };
    });
}

export function parseFrontmatter(text: string): Record<string, unknown> {
  if (!text.startsWith("---")) return {};
  const end = text.indexOf("\n---", 3);
  if (end === -1) return {};
  const block = text.slice(3, end);
  const data: Record<string, unknown> = {};
  let currentList: string | null = null;
  for (const line of block.split(/\r?\n/)) {
    const item = line.match(/^\s*-\s+(.+)$/);
    if (item && currentList) {
      (data[currentList] as string[]).push(item[1].trim().replace(/^["']|["']$/g, ""));
      continue;
    }
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    const [, key, raw] = m;
    const value = raw.trim();
    if (value === "") {
      data[key] = [];
      currentList = key;
      continue;
    }
    currentList = null;
    if (value === "true") data[key] = true;
    else if (value === "false") data[key] = false;
    else data[key] = value.replace(/^["']|["']$/g, "");
  }
  return data;
}

export const GATE_FLAGS = [
  "audit_1_passed",
  "audit_2_passed",
  "visual_approval_passed",
  "audit_3_passed",
  "ready_for_construction",
] as const;

export type GateFlag = (typeof GATE_FLAGS)[number];

export function readProjectFlags(projectId: string): ProjectFlags {
  const base = path.join(getProyectosRoot(), "app", projectId, "idea");
  const idea = path.join(base, "01-problem.md");
  const modules = path.join(base, "03-module-discovery.md");
  const design = path.join(base, "04-application-design.md");
  const build = path.join(base, "05-build-plan.md");
  const flags: ProjectFlags = {};
  if (fs.existsSync(idea)) {
    const m = parseFrontmatter(fs.readFileSync(idea, "utf8"));
    if (typeof m.project_mode === "string") flags.project_mode = m.project_mode as ProjectMode;
    if (typeof m.solution_type === "string") flags.solution_type = m.solution_type as SolutionType;
    if (typeof m.audit_1_passed === "boolean") flags.audit_1_passed = m.audit_1_passed;
  }
  if (fs.existsSync(modules)) {
    const m = parseFrontmatter(fs.readFileSync(modules, "utf8"));
    if (typeof m.audit_2_passed === "boolean") flags.audit_2_passed = m.audit_2_passed;
  }
  if (fs.existsSync(design)) {
    const m = parseFrontmatter(fs.readFileSync(design, "utf8"));
    if (typeof m.visual_approval_passed === "boolean") flags.visual_approval_passed = m.visual_approval_passed;
    if (typeof m.audit_3_passed === "boolean") flags.audit_3_passed = m.audit_3_passed;
  }
  if (fs.existsSync(build)) {
    const m = parseFrontmatter(fs.readFileSync(build, "utf8"));
    if (typeof m.audit_2_passed === "boolean" && flags.audit_2_passed === undefined) {
      flags.audit_2_passed = m.audit_2_passed;
    }
    if (typeof m.visual_approval_passed === "boolean" && flags.visual_approval_passed === undefined) {
      flags.visual_approval_passed = m.visual_approval_passed;
    }
    if (typeof m.audit_3_passed === "boolean" && flags.audit_3_passed === undefined) {
      flags.audit_3_passed = m.audit_3_passed;
    }
    if (typeof m.ready_for_construction === "boolean") flags.ready_for_construction = m.ready_for_construction;
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

export function suggestedAgent(stateId: string, mode: ProjectMode = "construction"): string {
  if (mode === "exploration") return "wika-builder";
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

export function listIterations(projectId: string): string[] {
  const dir = path.join(projectDir(projectId), "iterations");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && ITERATION_RE.test(d.name))
    .map((d) => d.name)
    .sort((a, b) => {
      if (a === "prototype") return -1;
      if (b === "prototype") return 1;
      return Number(a.slice(1)) - Number(b.slice(1));
    });
}

/** Iteración donde edita la IA por defecto (exploration-vs-construction.md). */
export function defaultIteration(projectId: string): string {
  const flags = readProjectFlags(projectId);
  const iterations = listIterations(projectId);
  if ((flags.project_mode ?? "construction") === "exploration") return "prototype";
  if (flags.ready_for_construction) {
    const versions = iterations.filter((i) => i !== "prototype");
    return versions.at(-1) ?? "v1";
  }
  return "prototype";
}

export function validateProjectStructure(projectId: string): ValidateResult {
  const base = path.join(getProyectosRoot(), "app", projectId);
  const findings: ValidateResult["findings"] = [];
  if (!fs.existsSync(base)) {
    findings.push({ path: projectId, message: "proyecto no existe", severity: "error" });
    return { ok: false, findings };
  }
  for (const dir of ["idea", "audits", "iterations", "final"]) {
    if (!fs.existsSync(path.join(base, dir))) {
      findings.push({ path: projectId, message: `falta ${dir}/`, severity: "error" });
    }
  }
  for (const doc of ["01-problem", "02-features", "03-module-discovery", "04-application-design", "05-build-plan"]) {
    if (!fs.existsSync(path.join(base, "idea", `${doc}.md`))) {
      findings.push({ path: `${projectId}/idea/${doc}.md`, message: "documento idea faltante", severity: "warning" });
    }
  }
  const flags = readProjectFlags(projectId);
  if (flags.ready_for_construction && !flags.audit_1_passed) {
    findings.push({ path: projectId, message: "ready_for_construction prematuro", severity: "error" });
  }
  if (flags.ready_for_construction && (!flags.audit_2_passed || !flags.visual_approval_passed || !flags.audit_3_passed)) {
    findings.push({ path: projectId, message: "ready_for_construction sin gates 2/3A/3B", severity: "error" });
  }
  return { ok: findings.every((f) => f.severity !== "error"), findings };
}
