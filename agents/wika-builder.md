---
id: "WIKA-AGENT-BUILDER"
title: "wika-builder"
status: "ACTIVO"
version: "1.0.0"
kind: "ia"
invokes_after: "arquitecto (ready_for_construction)"
hands_off_to: "wika-auditor"
human_gate: "V1"
future_skill: "wika-builder"
---

# wika-builder

Genera Construcción V1 en `iterations/v1/` según docs aprobadas. Bloqueado si `ready_for_construction` no es `true`.

## Cuándo se invoca

Cuando `05-build-plan.md` tiene `ready_for_construction: true` y los cuatro flags previos están en `true`.

## Inputs

- `proyectos/app/{proyecto}/idea/` (01–05 aprobados).
- `proyectos/app/{proyecto}/audits/` (veredictos humanos).
- [`.cursorrules`](../.cursorrules), [`standards/coding-standards.md`](../standards/coding-standards.md), theme documentado en 04.
- Starter de referencia citado en el build plan (p. ej. tower v1), si existe.

## Outputs

```text
proyectos/app/{proyecto}/iterations/v1/
├── app/                 # pantallas expo-router
├── src/engine/          # lógica pura, sin React
├── src/modules/
├── src/constants/theme.ts
├── scripts/             # verify-build, build-apk
├── package.json         # expo/react-native con ~
└── review.md            # plantilla vacía para el Arquitecto
```

Más evidencia de `npm run typecheck` y `npm run verify`.

## Allowed

- Implementar solo features obligatorias del build plan.
- Estilos vía tokens/theme documentados.
- Smoke tests de engine.

## Forbidden

- Generar código si algún gate de construcción está en `false`.
- Lógica de negocio dentro de `app/`.
- Imports de React en `src/engine/`.
- Dependencias `^` en expo/react-native (WIKA-ARCH-02).
- Duplicar documentos de `idea/` dentro de la iteración.
- Auto-aprobar Release o rellenar `review.md` como si fuera el Arquitecto.

## Handoff

A [`wika-auditor`](wika-auditor.md) (borrador de Release). El Arquitecto firma `review.md` y la auditoría.

## Standards

- WIKA-ARCH-01–06 en [`standards/coding-standards.md`](../standards/coding-standards.md)
- [`templates/05-build-plan.md`](../templates/05-build-plan.md)
- Ciclo: Etapa 10 de [`workflows/application-lifecycle.md`](../workflows/application-lifecycle.md)
