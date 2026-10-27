import type { AgentId, ProjectFlags, ProjectMode } from "@wika-studio/wika-client";

export interface AgentSpec {
  id: AgentId;
  /** Resumen de la ficha (se usa cuando no está disponible wika-fundaments). */
  summary: string;
  /** Rutas (relativas al proyecto, con glob simple `**`) que puede escribir por modo. */
  allowedPaths: (ctx: PathContext) => string[];
  /** Precondición de gates antes de invocar la IA. `null` si puede correr. */
  precondition: (ctx: PathContext) => GateBlock | null;
  /** Herramientas del SDK que se retiran al agente. */
  disallowedTools: string[];
  /** Documentos idea que se adjuntan al prompt. */
  ideaDocs: string[];
}

export interface PathContext {
  mode: ProjectMode;
  iteration: string;
  flags: ProjectFlags;
}

export interface GateBlock {
  missing_flag: string;
  suggested_action: string;
}

const ALL_IDEA = ["01-problem", "02-features", "03-module-discovery", "04-application-design", "05-build-plan"];

function iterationPath(ctx: PathContext): string {
  return `iterations/${ctx.iteration}/**`;
}

function builderPrecondition(ctx: PathContext): GateBlock | null {
  if (ctx.iteration === "prototype") return null;
  if (ctx.mode !== "construction") {
    return {
      missing_flag: "project_mode: construction",
      suggested_action: "En exploration la IA solo edita iterations/prototype/. Abre la sesión sobre prototype.",
    };
  }
  if (!ctx.flags.ready_for_construction) {
    return {
      missing_flag: "ready_for_construction",
      suggested_action: `Completa Gates 1–3B (audits/) o abre la sesión sobre iterations/prototype/.`,
    };
  }
  return null;
}

export const AGENT_CATALOG: Record<AgentId, AgentSpec> = {
  "wika-bootstrap": {
    id: "wika-bootstrap",
    summary: "Crea la estructura canónica proyectos/app/{p}/ y copia plantillas 01–05.",
    allowedPaths: () => ["**"],
    precondition: () => null,
    disallowedTools: ["shell", "delete", "task"],
    ideaDocs: [],
  },
  "wika-scribe": {
    id: "wika-scribe",
    summary: "Redacta y completa documentos idea/01–05 sin activar flags.",
    allowedPaths: () => ["idea/**"],
    precondition: () => null,
    disallowedTools: ["shell", "delete", "task"],
    ideaDocs: ALL_IDEA,
  },
  "wika-auditor": {
    id: "wika-auditor",
    summary: "Redacta borradores de auditoría en audits/ con veredicto PENDIENTE; nunca APROBADO.",
    allowedPaths: () => ["audits/**"],
    precondition: () => null,
    disallowedTools: ["shell", "delete", "task"],
    ideaDocs: ALL_IDEA,
  },
  "wika-designer": {
    id: "wika-designer",
    summary: "Redacta 04-application-design.md: rutas expo-router, tokens/theme y wireframe. No escribe código de pantallas.",
    allowedPaths: () => ["idea/04-application-design.md", "idea/assets/**"],
    precondition: (ctx) =>
      ctx.mode === "construction" && !ctx.flags.audit_2_passed
        ? {
            missing_flag: "audit_2_passed",
            suggested_action: "Gate 2 (auditoría de módulos) pendiente. En exploration puedes bosquejar 04 igualmente.",
          }
        : null,
    disallowedTools: ["shell", "delete", "task"],
    ideaDocs: ["01-problem", "02-features", "03-module-discovery", "04-application-design"],
  },
  "wika-builder": {
    id: "wika-builder",
    summary: "Construye la demo en vivo (pantallas, botones, tipografía, íconos, imágenes) en la iteración permitida.",
    allowedPaths: (ctx) => [iterationPath(ctx)],
    precondition: builderPrecondition,
    disallowedTools: ["task"],
    ideaDocs: ["01-problem", "02-features", "04-application-design", "05-build-plan"],
  },
  "wika-refiner": {
    id: "wika-refiner",
    summary: "Corrige hallazgos de review/release en la iteración activa.",
    allowedPaths: (ctx) => [iterationPath(ctx)],
    precondition: builderPrecondition,
    disallowedTools: ["task"],
    ideaDocs: ["02-features", "04-application-design", "05-build-plan"],
  },
  "wika-packager": {
    id: "wika-packager",
    summary: "Empaqueta final/ tras Release APROBADO.",
    allowedPaths: () => ["final/**"],
    precondition: (ctx) =>
      ctx.mode !== "construction"
        ? { missing_flag: "project_mode: construction", suggested_action: "wika-packager está prohibido en exploration." }
        : { missing_flag: "release APROBADO", suggested_action: "Release en audits/auditoria-release-v1.md debe estar APROBADO (v2 Studio)." },
    disallowedTools: ["task"],
    ideaDocs: ["05-build-plan"],
  },
};

export function getAgentSpec(agentId: string): AgentSpec {
  const spec = (AGENT_CATALOG as Record<string, AgentSpec>)[agentId];
  if (!spec) throw new Error(`agente desconocido: ${agentId}`);
  return spec;
}
