---
id: "WIKA-PROCESS-ENGINE"
title: "Motor de proceso WIKA"
status: "ACTIVO"
version: "1.0.0"
owner: "Arquitectura WIKA"
created_at: "2026-10-27"
updated_at: "2026-10-27"
---

# Motor de proceso WIKA

## Objetivo

Definir la **máquina de estados** computable del ciclo WIKA: estados, flags YAML, transiciones, agente sugerido y artefactos obligatorios. Complementa la narrativa de [`application-lifecycle.md`](application-lifecycle.md) sin reemplazarla.

## Audiencia

Implementadores de `wika-studio`, validadores (`validate_project`) y agentes IA.

## Fuente de verdad

Flags y gates: [`.cursorrules`](../.cursorrules).  
Narrativa de etapas: [`application-lifecycle.md`](application-lifecycle.md).  
Modos: [`exploration-vs-construction.md`](exploration-vs-construction.md).

## Relación con lifecycle y agentes

Cada **estado** corresponde a una etapa o sub-etapa del lifecycle. El campo `suggested_agent` indica quién actúa next según [`agents/README.md`](../agents/README.md). Solo **Arquitecto** ejecuta transiciones que ponen flags en `true`.

## Fuera de alcance

Implementación de código del BFF; reglas de negocio fuera de WIKA.

---

# Variables de estado (lectura desde `idea/`)

| Flag | Archivo(s) | Gate |
|------|------------|------|
| `audit_1_passed` | `01-problem.md`, `02-features.md` | 1 |
| `audit_2_passed` | `03-module-discovery.md` | 2 |
| `visual_approval_passed` | `04-application-design.md` | 3A |
| `audit_3_passed` | `04-application-design.md` | 3B |
| `ready_for_construction` | `05-build-plan.md` | V1 |
| `project_mode` | `01-problem.md` | `exploration` \| `construction` |

Release no usa flag en frontmatter; usa veredicto en `audits/auditoria-release-v1.md`.

---

# Estados (construction mode)

| state_id | Nombre | Condición de entrada | Bloquea |
|----------|--------|----------------------|---------|
| S00 | `init` | Proyecto creado, docs vacíos | — |
| S01 | `preparation_01_02` | Bootstrap hecho | Gate 1 |
| S02 | `gate_1_pending` | 01–02 completos, `audit_1_passed: false` | Módulos (03) |
| S03 | `module_discovery` | Gate 1 aprobado | Gate 2 |
| S04 | `gate_2_pending` | 03 completo, `audit_2_passed: false` | Diseño (04) |
| S05 | `application_design` | Gate 2 aprobado | Gate 3A |
| S06 | `gate_3a_pending` | 04 completo, `visual_approval_passed: false` | Build plan (05) ensamblado |
| S07 | `build_plan` | Gate 3A aprobado | Gate 3B |
| S08 | `gate_3b_pending` | 05 completo, flags previos true, `audit_3_passed: false` | `ready_for_construction` |
| S09 | `ready_build` | `ready_for_construction: true` | — |
| S10 | `construction_v1` | Builder activo / `iterations/v1/` existe | Release |
| S11 | `release_pending` | v1 presente, release no APROBADO | `final/` |
| S12 | `refinement` | Release con correcciones o vN+1 | — |
| S13 | `packaging` | Release APROBADO | Publicación |
| S14 | `demo` | `final/` generado | Producción |
| S15 | `published` | Demo aprobada | — |

---

# Transiciones (solo humano en gates)

| Desde | Evento | Hacia | Actor | Artefacto |
|-------|--------|-------|-------|-----------|
| S00 | `bootstrap_done` | S01 | IA bootstrap | estructura `proyectos/app/{p}/` |
| S01 | `docs_01_02_ready` | S02 | Negocio/scribe | 01, 02 |
| S02 | `gate_1_approved` | S03 | **Arquitecto** | `audits/auditoria-documentacion.md`, flags true |
| S03 | `doc_03_ready` | S04 | Scribe | 03 |
| S04 | `gate_2_approved` | S05 | **Arquitecto** | `audits/auditoria-modulos.md` |
| S05 | `doc_04_ready` | S06 | Designer | 04 |
| S06 | `gate_3a_approved` | S07 | **Arquitecto** | evidencia preview en 04 |
| S07 | `doc_05_ready` | S08 | Scribe | 05 |
| S08 | `gate_3b_approved` | S09 | **Arquitecto** | `audits/auditoria-ensamblado.md`, `ready_for_construction: true` |
| S09 | `build_started` | S10 | Builder | `iterations/v1/` |
| S10 | `build_submitted` | S11 | Builder | `review.md` |
| S11 | `release_approved` | S13 | **Arquitecto** | `audits/auditoria-release-v1.md` APROBADO |
| S11 | `release_rejected` | S12 | **Arquitecto** | correcciones → refiner |
| S13 | `packaged` | S14 | Packager | `final/` |
| S14 | `demo_approved` | S15 | Negocio | `demo-approved.md` |

---

# Agente sugerido por estado

| state_id | suggested_agent |
|----------|-----------------|
| S00 | `wika-bootstrap` |
| S01, S03, S07 | `wika-scribe` |
| S02, S04, S08, S11 | `wika-auditor` (borrador) + Arquitecto |
| S05, S06 | `wika-designer` |
| S09, S10 | `wika-builder` |
| S12 | `wika-refiner` |
| S13 | `wika-packager` |

---

# Función de resolución (pseudocódigo)

```text
function resolveState(projectPath):
  mode = readYaml(idea/01-problem.md).project_mode
  if mode == "exploration":
    return resolveExplorationState(projectPath)  # ver exploration-vs-construction.md
  flags = aggregateFlags(idea/*.md)
  if not exists(iterations/v1): return mapFlagsToConstructionState(flags)
  if releaseNotApproved(): return S11 or S12
  if exists(final/): return S14 or S15
  return S10 or S11
```

---

# Integración Studio

- `GET /projects/{id}/state` devuelve `state_id`, flags, `suggested_agent`, checklist pendiente.
- Validación previa: [`validate_project`](../docs/validate-project-spec.md).

---

# Documentos relacionados

- [`application-lifecycle.md`](application-lifecycle.md)
- [`exploration-vs-construction.md`](exploration-vs-construction.md)
- [`audit-event-schema.md`](../docs/audit-event-schema.md)
