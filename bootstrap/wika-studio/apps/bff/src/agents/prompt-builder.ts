import fs from "node:fs";
import path from "node:path";
import type { AgentId, ProjectFlags, ProjectMode } from "@wika-studio/wika-client";
import { getAgentSpec } from "./catalog.js";

export interface PromptInput {
  agentId: AgentId;
  projectId: string;
  projectDir: string;
  fundamentsRoot: string | null;
  mode: ProjectMode;
  stateId: string;
  flags: ProjectFlags;
  iteration: string;
  allowedPaths: string[];
  userText: string;
  /** Primer mensaje de la sesión: incluye contexto completo. */
  firstMessage: boolean;
  maxDocChars: number;
}

export interface BuiltPrompt {
  text: string;
  summary: string;
}

/**
 * Compone el prompt según docs/agent-orchestration.md (sección PromptBuilder):
 * identidad y límites → reglas globales → ficha → estado → documentos idea →
 * mensaje del dueño. En follow-ups solo se repiten identidad/límites.
 */
export class PromptBuilder {
  build(input: PromptInput): BuiltPrompt {
    const spec = getAgentSpec(input.agentId);
    const parts: string[] = [];

    parts.push(
      [
        `# Rol: ${input.agentId} (agente WIKA)`,
        `Proyecto: \`${input.projectId}\` — modo **${input.mode}**, estado ${input.stateId}, iteración de trabajo \`${input.iteration}\`.`,
        `Directorio de trabajo: \`${input.projectDir}\`.`,
        `Rutas permitidas para escribir (relativas al proyecto): ${input.allowedPaths.map((p) => `\`${p}\``).join(", ")}.`,
        spec.summary,
      ].join("\n"),
    );

    if (input.firstMessage) {
      const rules = readIfExists(input.fundamentsRoot && path.join(input.fundamentsRoot, ".cursorrules"));
      if (rules) parts.push(`# Reglas globales WIKA (.cursorrules)\n\n${truncate(rules, input.maxDocChars)}`);

      const ficha = readIfExists(input.fundamentsRoot && path.join(input.fundamentsRoot, "agents", `${input.agentId}.md`));
      if (ficha) parts.push(`# Ficha del agente\n\n${truncate(stripFrontmatter(ficha), input.maxDocChars)}`);

      parts.push(`# Estado del proyecto\n\n\`\`\`json\n${JSON.stringify({ mode: input.mode, state_id: input.stateId, flags: input.flags }, null, 2)}\n\`\`\``);

      const docs: string[] = [];
      for (const doc of spec.ideaDocs) {
        const content = readIfExists(path.join(input.projectDir, "idea", `${doc}.md`));
        if (content) docs.push(`## idea/${doc}.md\n\n${truncate(content, input.maxDocChars)}`);
      }
      if (docs.length) parts.push(`# Documentos idea\n\n${docs.join("\n\n")}`);

      if (input.allowedPaths.some((p) => p.startsWith("iterations/"))) {
        const readme = readIfExists(path.join(input.projectDir, "iterations", input.iteration, "README.md"));
        if (readme) parts.push(`# Iteración ${input.iteration}\n\n${truncate(readme, 2000)}`);
        parts.push(
          [
            "# Reglas de la demo en vivo",
            "- Tokens de `src/theme.ts`; prohibido hex suelto cuando existe token equivalente.",
            "- Lógica pura en `src/engine/` sin imports de React.",
            "- Versiones de expo/react-native con `~`, nunca `^`.",
            "- El dev server ya está corriendo con hot reload: edita archivos y el preview se actualiza solo. No ejecutes `npm run dev`.",
            "- Si agregas dependencias npm, dilo explícitamente al final (Studio las instalará).",
          ].join("\n"),
        );
      }
    }

    parts.push(`# Mensaje del dueño\n\n${input.userText.trim()}`);

    parts.push(
      [
        "# Instrucciones fijas",
        "- No modifiques flags YAML de gates (`audit_*_passed`, `visual_approval_passed`, `ready_for_construction`).",
        "- No escribas fuera de las rutas permitidas ni escribas APROBADO en auditorías.",
        "- Al terminar, resume los cambios realizados con rutas relativas.",
      ].join("\n"),
    );

    return { text: parts.join("\n\n---\n\n"), summary: summarize(input.userText) };
  }
}

function readIfExists(file: string | null | ""): string | null {
  if (!file) return null;
  try {
    return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  } catch {
    return null;
  }
}

function stripFrontmatter(md: string): string {
  if (!md.startsWith("---")) return md;
  const end = md.indexOf("\n---", 3);
  return end === -1 ? md : md.slice(end + 4).trimStart();
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n\n[... truncado: ${text.length - max} caracteres omitidos ...]`;
}

export function summarize(text: string, max = 80): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length <= max ? oneLine : `${oneLine.slice(0, max - 1)}…`;
}
