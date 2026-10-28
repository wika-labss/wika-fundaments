import fs from "node:fs";
import path from "node:path";
import type { CreateProjectRequest, CreateProjectResponse, SolutionType } from "@wika-studio/wika-client";
import { getConfig } from "../config.js";
import { HttpError, isValidProjectId, projectDir } from "../projects.js";

const IDEA_DOCS = ["01-problem", "02-features", "03-module-discovery", "04-application-design", "05-build-plan"] as const;

export function templateForSolution(solutionType: SolutionType): "expo-prototype" | "web-prototype" {
  return solutionType === "web_app" ? "web-prototype" : "expo-prototype";
}

export function channelsForSolution(solutionType: SolutionType): string[] {
  switch (solutionType) {
    case "web_app":
      return ["web"];
    case "hybrid":
      return ["android", "web"];
    default:
      return ["android"];
  }
}

/**
 * Rol de `wika-bootstrap` ejecutado por el BFF (no requiere IA): crea la
 * estructura canónica `proyectos/app/{p}/` desde las plantillas 01–05 de
 * wika-fundaments y copia la plantilla de iteración a `iterations/prototype/`.
 */
export function bootstrapProject(input: CreateProjectRequest): CreateProjectResponse {
  const config = getConfig();
  if (!isValidProjectId(input.project_id)) {
    throw new HttpError(400, "BAD_PROJECT_ID", "project_id debe ser kebab-case (a-z, 0-9, guiones)");
  }
  const dir = projectDir(input.project_id);
  if (fs.existsSync(dir)) {
    throw new HttpError(409, "PROJECT_EXISTS", `el proyecto ${input.project_id} ya existe`);
  }
  const created: string[] = [];
  const today = new Date().toISOString().slice(0, 10);
  const title = input.title?.trim() || input.project_id;
  const owner = input.owner?.trim() || "WIKA";

  for (const sub of ["idea", "audits", "iterations", "final"]) {
    fs.mkdirSync(path.join(dir, sub), { recursive: true });
  }

  for (const doc of IDEA_DOCS) {
    const target = path.join(dir, "idea", `${doc}.md`);
    const source = config.fundamentsRoot ? path.join(config.fundamentsRoot, "templates", `${doc}.md`) : null;
    let content = source && fs.existsSync(source) ? fs.readFileSync(source, "utf8") : fallbackTemplate(doc);
    content = fillFrontmatter(content, {
      title: doc === "01-problem" ? title : undefined,
      owner,
      created_at: today,
      updated_at: today,
      solution_type: doc === "01-problem" ? input.solution_type : undefined,
      project_mode: doc === "01-problem" ? input.project_mode : undefined,
      delivery_channels: doc === "01-problem" ? channelsForSolution(input.solution_type) : undefined,
    });
    content = content.replaceAll("[Nombre del Proyecto]", title).replaceAll("[nombre-proyecto]", input.project_id);
    if (doc === "01-problem" && input.problem_statement?.trim()) {
      content += `\n\n## Planteamiento inicial del cliente\n\n${input.problem_statement.trim()}\n`;
    }
    fs.writeFileSync(target, content);
    created.push(path.relative(dir, target));
  }

  const template = templateForSolution(input.solution_type);
  const templateDir = path.join(config.templatesDir, template);
  const prototypeDir = path.join(dir, "iterations", "prototype");
  if (!fs.existsSync(templateDir)) {
    throw new HttpError(500, "TEMPLATE_MISSING", `falta la plantilla ${template} en ${config.templatesDir}`);
  }
  copyDir(templateDir, prototypeDir, created, dir);
  fs.writeFileSync(path.join(dir, "audits", ".gitkeep"), "");
  fs.writeFileSync(path.join(dir, "final", ".gitkeep"), "");
  fs.writeFileSync(
    path.join(dir, "README.md"),
    `# ${title}\n\nProyecto WIKA (${input.project_mode}, ${input.solution_type}). Documentos en \`idea/\`, prototipo en \`iterations/prototype/\`.\n`,
  );
  created.push("README.md");

  return {
    project: {
      project_id: input.project_id,
      path: dir,
      mode: input.project_mode,
      solution_type: input.solution_type,
    },
    created_files: created,
  };
}

function copyDir(from: string, to: string, created: string[], projectRoot: string): void {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".expo" || entry.name === "dist") continue;
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyDir(src, dst, created, projectRoot);
    } else {
      fs.copyFileSync(src, dst);
      created.push(path.relative(projectRoot, dst));
    }
  }
}

export function fillFrontmatter(
  content: string,
  values: Record<string, string | string[] | undefined>,
): string {
  if (!content.startsWith("---")) return content;
  const end = content.indexOf("\n---", 3);
  if (end === -1) return content;
  let block = content.slice(3, end);
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      const rendered = `${key}:\n${value.map((v) => `  - ${v}`).join("\n")}`;
      const re = new RegExp(`^${key}:\\s*\\n(?:\\s+-\\s+.*\\n?)*`, "m");
      block = re.test(block) ? block.replace(re, `${rendered}\n`) : `${block.trimEnd()}\n${rendered}\n`;
    } else {
      const re = new RegExp(`^${key}:.*$`, "m");
      const line = `${key}: "${value}"`;
      block = re.test(block) ? block.replace(re, line) : `${block.trimEnd()}\n${line}\n`;
    }
  }
  return `---${block}${content.slice(end)}`;
}

function fallbackTemplate(doc: (typeof IDEA_DOCS)[number]): string {
  const flags: Record<(typeof IDEA_DOCS)[number], string[]> = {
    "01-problem": ["audit_1_passed: false", 'solution_type: "mobile_app"', "delivery_channels:\n  - android", 'project_mode: "construction"'],
    "02-features": ["audit_1_passed: false"],
    "03-module-discovery": ["audit_1_passed: false", "audit_2_passed: false"],
    "04-application-design": ["audit_1_passed: false", "audit_2_passed: false", "visual_approval_passed: false", "audit_3_passed: false"],
    "05-build-plan": [
      "audit_1_passed: false",
      "audit_2_passed: false",
      "visual_approval_passed: false",
      "audit_3_passed: false",
      "ready_for_construction: false",
    ],
  };
  return `---\nid: "${doc.toUpperCase()}"\ntitle: "[Nombre del Proyecto]"\nstatus: "BORRADOR"\nversion: "1.0.0"\nowner: "WIKA"\ncreated_at: "YYYY-MM-DD"\nupdated_at: "YYYY-MM-DD"\n${flags[doc].join("\n")}\n---\n\n# ${doc}\n\n> Plantilla mínima generada por WIKA Studio (no se encontró wika-fundaments/templates). Reemplazar por la plantilla oficial.\n`;
}
