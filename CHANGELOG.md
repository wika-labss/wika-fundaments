# Changelog

Registro de cambios relevantes de `wika-fundaments`.

## Unreleased

### Added

- Plantillas v2.1 con YAML frontmatter, RTM 1:1, BDD/Gherkin y gates (`audit_1_passed`, `audit_2_passed`, `visual_approval_passed`, `audit_3_passed`, `ready_for_construction`).
- `standards/coding-standards.md` — WIKA-ARCH-01–06 y stack Expo/RN.
- `standards/design-system.md` — tokens base V1 y relación con pipeline `design-system/` V3+.
- `.cursorrules` — quality gates automatizables para agentes IA.

### Changed

- Plantillas `01-problem.md` a `05-build-plan.md` de scaffolds vacíos a contratos parseables por IA.
- `templates/README.md` — mapa de trazabilidad y equivalencia flags ↔ auditorías.
- `standards/README.md` — índice de estándares.
- Auditorías `auditoria-documentacion.md`, `auditoria-modulos.md`, `auditoria-ensamblado.md` — validaciones RTM/YAML y activación de gates.

### Previous (v2 migration)

- Reorganización estructural del repositorio.
- Normalización de nombres de archivos a kebab-case.
- Eliminación de carpetas `rules/`, `functions/` y `architecture/`.
- Reglas movidas a `docs/documentation.md` y `docs/repositories.md`.
