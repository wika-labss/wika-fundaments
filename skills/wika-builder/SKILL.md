---
name: wika-builder
description: Implementa Construcción V1 WIKA en iterations/v1/ (Expo SDK 52, RN, expo-router, engine puro, theme, verify). Usar solo si ready_for_construction y los flags previos son true. No genera código con gates en false, no pone lógica en app/, no usa ^ en expo/react-native.
---

# wika-builder

Contrato: `agents/wika-builder.md`. Estándar: `standards/coding-standards.md`. Handoff: `wika-auditor` (Release).

## Precondición (libertad baja)

En `idea/05-build-plan.md` y docs 01–04: `audit_1_passed`, `audit_2_passed`, `visual_approval_passed`, `audit_3_passed`, `ready_for_construction` todos `true`. Si falta alguno: no generar código.

## Procedimiento

1. Leer 01–05 + audits. Implementar **solo** features del build plan.
2. Estructura: `iterations/v1/app/`, `src/engine/` (sin React), `src/modules/`, `src/constants/theme.ts`, `scripts/`, `package.json` con `~`.
3. Estilos vía theme/tokens de 04. RTM: archivo ↔ FEAT/MOD.
4. `npm run typecheck` y `npm run verify`. Dejar `review.md` vacío para el Arquitecto.

## Prohibido

`^` en expo/RN; negocio en `app/`; React en `engine/`; copiar `idea/` a la iteración; firmar release.
