---
name: wika-packager
description: Consolida la iteración aprobada en final/ (source, apk, release-notes). Usar solo cuando audits/auditoria-release-v1.md está APROBADO por el arquitecto. No empaqueta sin esa firma, no duplica idea/ en final/ y no publica a store.
---

# wika-packager

Contrato: `agents/wika-packager.md`. Handoff: Negocio (demo / publicación).

## Precondición

`proyectos/app/{proyecto}/audits/auditoria-release-v1.md` = **APROBADO** (humano). Si no, parar; usar `wika-auditor` o `wika-refiner`.

## Procedimiento

1. Copiar source y APK (o artefacto del build plan) de la iteración nominada a `final/`.
2. Escribir `final/release-notes.md`: features, cambios, despliegue, versión.
3. No copiar `01-problem.md` … `05-build-plan.md` a `final/documentation/` como fuente de verdad (esa sigue en `idea/`).

## Prohibido

Empaquetar sin APROBADO; publicar a producción/store; flags YAML.
