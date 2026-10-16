# Changelog

Registro de cambios relevantes de `wika-fundaments`.

## Unreleased

### Added

- Stack web (Next.js + Supabase) documentado en `standards/coding-standards.md` para el ecommerce MEMIN Clothes cuando el build plan no es APK.

### Added (previo)

- Catálogo nominativo en `agents/`: siete agentes IA (`wika-bootstrap` … `wika-packager`) y roles humanos (Negocio, Arquitecto). Skills Cursor quedan para un siguiente paso (`future_skill`).
- `scripts/validate_docs.py` comprueba que el índice de `agents/` lista fichas con `future_skill` y `hands_off_to`.

- `docs/auditoria-release-v1.md` — auditoría post-build que bloquea `final/` y publicación.
- `scripts/validate_docs.py` y `tests/test_validate_docs.py` — detector de referencias rotas, rutas obsoletas y fences Markdown.
- Gate Release en `.cursorrules`.
- CI `.github/workflows/docs-consistency.yml` — valida consistencia documental en push/PR.

### Fixed

- Ciclo de vida oficial alineado a gates v2.1 (`workflows/application-lifecycle.md`).
- Referencias rotas a `auditoria-1.md`, `auditoria-2.md` y `bodega.md`.
- Ruta canónica de productos: `proyectos/app/{proyecto}/` (deja de usarse `applications/` como raíz).
- Pipeline design-system: 12 etapas (v2) en `.cursorrules`.
- `mobile-template` alineado a Expo/RN (ya no Flutter como stack V1).
- Fence Markdown sin cerrar en `README.md`.
- Flag de Gate 2 retirado de la plantilla `02-features.md`.
- Orden del ciclo en `templates/README.md`: el plan de construcción es entrada del ensamblado.

### Added (previo)

- `docs/instructivo-nuevos-usuarios.md` — guía de inicio y cierre del flujo WIKA para nuevos usuarios.
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
