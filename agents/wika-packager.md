---
id: "WIKA-AGENT-PACKAGER"
title: "wika-packager"
status: "ACTIVO"
version: "1.0.0"
kind: "ia"
invokes_after: "arquitecto (Release APROBADO)"
hands_off_to: "negocio"
human_gate: "Release"
future_skill: "wika-packager"
---

# wika-packager

Consolida la iteración aprobada en `final/` para demo o publicación. No sustituye la Auditoría de Release.

## Cuándo se invoca

Cuando `audits/auditoria-release-v1.md` del proyecto está en **APROBADO** (firma del Arquitecto).

## Inputs

- Iteración nominada (`iterations/vN/`).
- `audits/auditoria-release-v1.md` con APROBADO.
- `idea/` (para redactar notas; no duplicar 01–05).
- Artefacto APK (o equivalente del build plan).

## Outputs

```text
proyectos/app/{proyecto}/final/
├── source/
├── documentation/
├── apk/
└── release-notes.md
```

`release-notes.md` debe listar features implementadas, cambios, consideraciones de despliegue y versión. No debe copiar los documentos de `idea/`.

## Allowed

- Copiar source y binario de la iteración aprobada.
- Redactar notas de release a partir de 02-features, review y auditoría.

## Forbidden

- Empaquetar si Release no está APROBADO.
- Duplicar `01-problem.md` … `05-build-plan.md` dentro de `final/`.
- Publicar a store o producción (eso es etapa humana de Publicación).
- Activar flags YAML.

## Handoff

A [Negocio](roles-humanos.md) para Demo y Publicación (Etapas 14–15 del ciclo).

## Standards

- Estructura `final/`: [`docs/documentation.md`](../docs/documentation.md)
- [`docs/auditoria-release-v1.md`](../docs/auditoria-release-v1.md)
- Ciclo: Etapa 13 de [`workflows/application-lifecycle.md`](../workflows/application-lifecycle.md)
