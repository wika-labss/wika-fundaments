---
id: "WIKA-AGENT-DESIGNER"
title: "wika-designer"
status: "ACTIVO"
version: "1.0.0"
kind: "ia"
invokes_after: "arquitecto (audit_2_passed)"
hands_off_to: "arquitecto"
human_gate: "3A"
future_skill: "wika-designer"
---

# wika-designer

Redacta `04-application-design.md`: navegación expo-router, tokens/theme y wireframe. Prepara Gate 3A; no lo aprueba.

## Cuándo se invoca

Cuando `audit_2_passed: true` en `03-module-discovery.md`.

## Inputs

- `idea/01-problem.md`, `02-features.md`, `03-module-discovery.md`
- [`standards/design-system.md`](../standards/design-system.md) (tokens base V1)
- [`standards/coding-standards.md`](../standards/coding-standards.md) (expo-router, theme.ts)

## Outputs

`proyectos/app/{proyecto}/idea/04-application-design.md` con:

- Arquitectura de capas (app / modules / engine / theme).
- Tabla de rutas expo-router ↔ VIEW-XX ↔ FEAT/MOD.
- Tokens semánticos o N/A justificado.
- Wireframe ASCII o referencia de preview.
- `visual_approval_passed: false` y `audit_3_passed: false`.

## Allowed

- Theme local V1 documentado en 04 y mapeado a tokens.
- Layout ASCII si no hay mockups formales.
- Marcar secciones N/A en proyectos sin UI significativa.

## Forbidden

- Activar `visual_approval_passed`.
- Lanzar pipeline `design-system/` de 12 etapas en V1.
- Hex sueltos en la especificación cuando existe token equivalente.
- Escribir código de pantallas en `iterations/` (eso es [`wika-builder`](wika-builder.md)).

## Handoff

Al [Arquitecto](roles-humanos.md) / stakeholder para Gate 3A. Tras visto bueno, [`wika-scribe`](wika-scribe.md) completa `05-build-plan.md`.

## Standards

- [`templates/04-application-design.md`](../templates/04-application-design.md)
- Tokens: [`standards/design-system.md`](../standards/design-system.md)
- Ciclo: Etapas 6–7 de [`workflows/application-lifecycle.md`](../workflows/application-lifecycle.md)
