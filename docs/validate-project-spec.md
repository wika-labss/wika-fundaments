---
id: "WIKA-VALIDATE-PROJECT-SPEC"
title: "Especificación validate_project"
status: "ACTIVO"
version: "1.0.0"
owner: "Arquitectura WIKA"
created_at: "2026-10-27"
updated_at: "2026-10-27"
---

# Especificación validate_project

## Objetivo

Describir qué valida [`scripts/validate_project.py`](../scripts/validate_project.py) sobre `proyectos/app/{proyecto}/` (o fixtures de prueba).

## Audiencia

Studio BFF, CI del repo `proyectos`, arquitectos.

## Fuente de verdad

Schemas: [`schemas/`](../schemas/README.md).  
Gates: [`.cursorrules`](../.cursorrules).  
Motor: [`process-engine.md`](../workflows/process-engine.md).

## Relación con lifecycle y agentes

Errores de validación bloquean jobs `build_v1` y solicitudes de gate en Studio.

## Fuera de alcance

Validar contenido narrativo completo de RTM (solo presencia mínima e IDs).

---

# Entrada CLI

```bash
python3 scripts/validate_project.py --project /path/to/proyectos/app/{proyecto}
python3 scripts/validate_project.py --root /path/to/proyectos   # todos bajo app/
```

Exit code `0` = OK; `1` = errores listados en stderr.

---

# Reglas

## Estructura

- Directorios obligatorios: `idea/`, `audits/`, `iterations/`, `final/` (vacíos permitidos).
- Archivos obligatorios en `idea/`: `01-problem.md` … `05-build-plan.md`.

## Frontmatter

- Parseo YAML entre fences `---`.
- Campos requeridos según schema por archivo (enums `solution_type`, `project_mode`, etc.).
- Tipos booleanos para flags de gate.

## Coherencia de flags

| Regla | Mensaje |
|-------|---------|
| `ready_for_construction: true` implica todos los flags previos `true` en 05 | `ready_for_construction prematuro` |
| `audit_2_passed: true` en 03 implica `audit_1_passed: true` en 01, 02, 03 | `gate 2 sin gate 1` |
| `visual_approval_passed: true` implica `audit_2_passed: true` | `gate 3a sin gate 2` |
| `audit_3_passed: true` en 04 implica gates previos | `gate 3b visual incoherente` |
| 01 y 02 `audit_1_passed` deben coincidir | `audit_1 inconsistente` |

## Modo construction

- Si `project_mode: construction` y `ready_for_construction: true`, debe existir directorio `iterations/v1/` **o** el validador emite warning (no error) si aún no construido — configurable; v1 emite **warning** `v1 ausente`.

## Modo exploration

- Permite `ready_for_construction: false` con `iterations/prototype/`.
- Prohibido `final/` con contenido si `project_mode: exploration` (error).

---

# Integración Studio

`POST /projects/{id}/validate` ejecuta el mismo script y devuelve `{ "ok": bool, "findings": [...] }`.

---

# Documentos relacionados

- [`studio-readiness-checklist.md`](studio-readiness-checklist.md)
- [`repositorio-proyectos.md`](repositorio-proyectos.md)
