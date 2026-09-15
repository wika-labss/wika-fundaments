---
name: wika-orchestrator
description: Enruta un flujo WIKA (idea a publicación) al agente correcto. Usar al iniciar o retomar un proyecto WIKA, cuando el usuario pide crear una app, avanzar un gate, generar docs, construir V1, refinar o empaquetar, o no sabe qué agente invocar. No genera código ni aprueba auditorías.
---

# wika-orchestrator

Elegir **una** skill de agente y parar. No mezclar etapas.

Contrato: `agents/README.md`. Ruta: `proyectos/app/{proyecto}/`.

## Autoridad

IA genera. Arquitecto aprueba flags YAML y **APROBADO**. Nunca poner gates en `true`.

## Router

| Señal | Skill |
|-------|--------|
| No existe `proyectos/app/{nombre}/` | `wika-bootstrap` |
| Faltan 01–02, 03 o 05 en `idea/` | `wika-scribe` |
| Pedido de auditoría, gaps, checklist de gate | `wika-auditor` |
| Diseño, navegación, wireframe, tokens V1, doc 04 | `wika-designer` |
| Código V1 / APK y `ready_for_construction: true` | `wika-builder` |
| `review.md` o Release REQUIERE CORRECCIONES | `wika-refiner` |
| Release **APROBADO** y poblar `final/` | `wika-packager` |
| Pedido de código con flags en `false` | Rechazar; indicar ficha + auditoría |

Si varios aplican, tomar el **primero** en el ciclo (bootstrap → scribe → auditor → designer → scribe 05 → builder → auditor release → refiner/packager).
