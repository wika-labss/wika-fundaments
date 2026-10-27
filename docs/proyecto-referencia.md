---
id: "WIKA-REF-PROJECT"
title: "Proyecto referencia (gold path)"
status: "ACTIVO"
version: "1.0.0"
owner: "Arquitectura WIKA"
created_at: "2026-10-27"
updated_at: "2026-10-27"
---

# Proyecto referencia (gold path)

## Objetivo

Definir criterios del **proyecto referencia** en `proyectos/app/{referencia}/` para validar WIKA Studio, agentes y CI contra un recorrido real.

## Audiencia

QA, arquitectos, implementadores Studio.

## Fuente de verdad

Charter portafolio: [`repositorio-proyectos.md`](repositorio-proyectos.md).  
Lifecycle: [`application-lifecycle.md`](../workflows/application-lifecycle.md).

## Relación con lifecycle y agentes

El gold path debe ser reproducible invocando la cadena de agentes documentada en [`agents/README.md`](../agents/README.md).

## Fuera de alcance

Mantener el repo referencia en este PR (puede crearse después); este doc fija **criterios**.

---

# Identificador sugerido

| Campo | Valor sugerido |
|-------|----------------|
| `project_id` | `tower` o `wika-demo-tower` |
| `solution_type` | `game` o `mobile_app` |
| `project_mode` | `construction` |
| `delivery_channels` | `["android"]` (ampliar a `web` para probar híbrido) |

Referencia histórica en plantilla 05: `proyectos/app/tower/iterations/v1/`.

---

# Checklist gold path (construction)

| # | Criterio | Evidencia |
|---|----------|-----------|
| G1 | Existe `idea/01–05` con frontmatter válido vs schemas | `validate_project` OK |
| G2 | Gates 1–3B aprobados en `audits/` | flags true coherentes |
| G3 | `ready_for_construction: true` | 05-build-plan.md |
| G4 | `iterations/v1/` con `npm run verify` documentado | scripts WIKA |
| G5 | `audits/auditoria-release-v1.md` con veredicto | APROBADO o REQUIERE CORRECCIONES documentado |
| G6 | RTM ERR→FEAT→MOD trazable en 01–03 | revisión manual |
| G7 | Al menos un escenario BDD en 02 ejecutable en v1 | notas en review.md |

---

# Checklist Studio (UI-A)

| # | Criterio |
|---|----------|
| S1 | Studio lista el proyecto referencia (P-01) |
| S2 | P-03 muestra `state_id` coherente con process-engine |
| S3 | P-05 validate coincide con CLI |
| S4 | P-07 simulado en dev aprueba gate con evento en timeline |

---

# Modo exploration (opcional)

Segundo path en `proyectos/app/wika-sandbox/`:

- `project_mode: exploration`
- `iterations/prototype/` con preview URL
- Verificar que **no** exista `final/` sin promoción

---

# Documentos relacionados

- [`studio-readiness-checklist.md`](studio-readiness-checklist.md)
- [`iteration-environment-spec.md`](iteration-environment-spec.md)
