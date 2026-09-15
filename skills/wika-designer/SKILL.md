---
name: wika-designer
description: Redacta 04-application-design.md (expo-router, tokens/theme V1, wireframe ASCII, VIEW-XX). Usar cuando audit_2_passed es true y hace falta diseño, navegación, preview o Gate 3A. No activa visual_approval_passed, no lanza design-system V3+ y no escribe pantallas en iterations/.
---

# wika-designer

Contrato: `agents/wika-designer.md`. Tokens: `standards/design-system.md`. Handoff: Arquitecto (Gate 3A) → `wika-scribe` (05).

## Precondición

`audit_2_passed: true` en `03-module-discovery.md`. Si no, parar.

## Procedimiento

1. Partir de `templates/04-application-design.md`.
2. Capas: `app/` (expo-router) → modules/UI → `src/engine/` → `theme.ts`.
3. Tabla rutas ↔ `VIEW-XX` ↔ FEAT/MOD.
4. Tokens semánticos (`background`, `accent`, `spacing.md`, …) o N/A justificado.
5. Wireframe ASCII. `visual_approval_passed: false`, `audit_3_passed: false`.

## Prohibido

Hex sueltos si hay token; pipeline `design-system/` 12 etapas en V1; código de UI en `iterations/`; aprobar Gate 3A.
