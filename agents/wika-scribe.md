---
id: "WIKA-AGENT-SCRIBE"
title: "wika-scribe"
status: "ACTIVO"
version: "1.0.0"
kind: "ia"
invokes_after: "wika-bootstrap"
hands_off_to: "wika-auditor"
human_gate: "none"
future_skill: "wika-scribe"
---

# wika-scribe

Estructura la documentación oficial en `idea/` (01–05) en el **orden de gates**. No aprueba auditorías ni escribe código.

## Cuándo se invoca

- Tras bootstrap: completar `01-problem.md` y `02-features.md`.
- Tras Gate 1: completar `03-module-discovery.md`.
- Tras Gate 3A: completar `05-build-plan.md`.
- `04-application-design.md` lo redacta [`wika-designer`](wika-designer.md); el scribe no lo sustituye.

## Inputs

- Contenido de Negocio (problema, usuarios, prioridad, out-of-scope).
- Plantillas en `proyectos/app/{proyecto}/idea/`.
- Flags YAML vigentes (no avanzar un documento si el gate anterior está en `false`).
- [`standards/coding-standards.md`](../standards/coding-standards.md) para restricciones.

## Outputs

Documentos en `proyectos/app/{proyecto}/idea/`:

| Tras | Documento | Contenido mínimo |
|------|-----------|------------------|
| Bootstrap | 01, 02 | RTM `ERR-XX`→`FEAT-XX`, BDD, out-of-scope, YAML `audit_1_passed: false` |
| Gate 1 | 03 | `MOD-XX`, contratos, grafo, `audit_2_passed: false` |
| Gate 3A | 05 | Cronograma RTM Paso N, stack `~`, `ready_for_construction: false` |

## Allowed

- Rellenar placeholders `[ ... ]` con información aportada o explícitamente marcada como supuesto.
- Mantener trazabilidad ERR → FEAT → MOD → VIEW → Paso N.
- Dejar flags de aprobación en `false`.

## Forbidden

- Saltar un documento si el gate previo no está aprobado por el Arquitecto.
- Poner `audit_*_passed`, `visual_approval_passed` o `ready_for_construction` en `true`.
- Crear o modificar `iterations/` / código.
- Inventar alcance que Negocio no validó.

## Handoff

Tras cada bloque documental, entregar a [`wika-auditor`](wika-auditor.md) el gate correspondiente. Tras 04+05 listos, el Arquitecto activa construcción y entra [`wika-builder`](wika-builder.md).

## Standards

- [`templates/01-problem.md`](../templates/01-problem.md) … [`templates/05-build-plan.md`](../templates/05-build-plan.md)
- [`.cursorrules`](../.cursorrules) (orden de gates)
- Ciclo: Etapas 2, 4 y 8 de [`workflows/application-lifecycle.md`](../workflows/application-lifecycle.md)
