import type { AgentId, ProjectFlags, ProjectMode } from "@wika-studio/wika-client";
import { GATE_FLAGS, parseFrontmatter } from "../projects.js";
import { type GateBlock, getAgentSpec, type PathContext } from "./catalog.js";

export interface Violation {
  path: string;
  reason: string;
}

export interface FileSnapshot {
  /** Ruta relativa al proyecto → contenido antes del run (null si no existía). */
  before: Map<string, string | null>;
}

/**
 * Guarda de gates (docs/agent-orchestration.md): decide si un agente puede
 * correr y, tras el run, qué archivos cambiados violan las reglas.
 * Funciones puras: el revert lo ejecuta CheckpointService.
 */
export class GateGuard {
  allowedPaths(agentId: AgentId, ctx: PathContext): string[] {
    return getAgentSpec(agentId).allowedPaths(ctx);
  }

  precheck(agentId: AgentId, ctx: PathContext): GateBlock | null {
    return getAgentSpec(agentId).precondition(ctx);
  }

  /**
   * @param changed rutas relativas al proyecto con separador `/`
   * @param readAfter devuelve el contenido actual (null si fue borrado)
   */
  postcheck(
    changed: string[],
    allowed: string[],
    before: Map<string, string | null>,
    readAfter: (relPath: string) => string | null,
  ): Violation[] {
    const violations: Violation[] = [];
    for (const rel of changed) {
      const norm = rel.replaceAll("\\", "/");
      if (!matchesAny(norm, allowed)) {
        violations.push({ path: norm, reason: `fuera de la ruta permitida (${allowed.join(", ")})` });
        continue;
      }
      if (norm.startsWith("idea/") && norm.endsWith(".md")) {
        const after = readAfter(norm);
        const flagsAfter = after ? extractGateFlags(after) : {};
        const prev = before.get(norm);
        const flagsBefore = prev ? extractGateFlags(prev) : {};
        for (const flag of GATE_FLAGS) {
          if (flagsAfter[flag] === true && flagsBefore[flag] !== true) {
            violations.push({ path: norm, reason: `intento de activar ${flag}: true (solo Arquitecto)` });
            break;
          }
        }
      }
      if (norm.startsWith("audits/") && norm.endsWith(".md")) {
        const after = readAfter(norm) ?? "";
        const prev = before.get(norm) ?? "";
        if (countApproved(after) > countApproved(prev)) {
          violations.push({ path: norm, reason: "veredicto APROBADO solo lo escribe el Arquitecto" });
        }
      }
    }
    return violations;
  }
}

export function extractGateFlags(markdown: string): Partial<Record<(typeof GATE_FLAGS)[number], boolean>> {
  const fm = parseFrontmatter(markdown);
  const out: Partial<Record<(typeof GATE_FLAGS)[number], boolean>> = {};
  for (const flag of GATE_FLAGS) {
    if (typeof fm[flag] === "boolean") out[flag] = fm[flag] as boolean;
  }
  return out;
}

function countApproved(text: string): number {
  return (text.match(/\bAPROBADO\b/g) ?? []).length;
}

/** Glob mínimo: `**` = cualquier subruta, `*` = segmento sin `/`. */
export function matchesAny(relPath: string, patterns: string[]): boolean {
  return patterns.some((p) => globToRegExp(p).test(relPath));
}

export function globToRegExp(pattern: string): RegExp {
  let re = "";
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === "*") {
      if (pattern[i + 1] === "*") {
        re += ".*";
        i++;
        if (pattern[i + 1] === "/") i++;
      } else {
        re += "[^/]*";
      }
    } else if (/[.+?^${}()|[\]\\]/.test(ch)) {
      re += `\\${ch}`;
    } else {
      re += ch;
    }
  }
  return new RegExp(`^${re}$`);
}

export function buildPathContext(mode: ProjectMode, iteration: string, flags: ProjectFlags): PathContext {
  return { mode, iteration, flags };
}
