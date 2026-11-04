# Changelog

Registro de cambios relevantes de `wika-fundaments`.

## Unreleased

### Added

- **Bóveda de diseños** `bodega-disenos/`: catálogo de skills visuales y lote trabajamos.com (looks LinkedIn · Elegante · Colorido) con capturas y mapa skill→look.
- **Bóveda — tipografía sobre Look C:** forks C1 Syne denso (`8542b742`), C2 Editorial Newsreader (`e9a803dc`) y C3 Jakarta (`0d3578ce`, candado tipográfico). C1 y C2 archivados. Notas y capturas en `bodega-disenos/proyectos/trabajamos-com/look-c-tipo/`.
- **Bóveda — color y banner sobre C3:** skills de Coral, Lima y Cobalto (`design-taste-frontend` en eje color + `redesign-skill`; banner estático → móvil CSS). Carpeta `bodega-disenos/proyectos/trabajamos-com/look-c-colores/`.
- **Bóveda — Coral:** `cursor/look-c-color-coral-aa58` @ `47da9ba5`. Paleta coral `#e85d4c` + ink `#1c1412` + paper `#fff6f3`. Banner stripe drift (`translate3d`, freeze en reduced-motion). Tests 64/64. Capturas inicio, perfil y mobile. Lima y Cobalto siguen pendientes.
- Contratos UI-B en `docs/studio-api-contract.md` (v1.1.0): autenticación de dueños, catálogo de modelos, sesiones de chat con agentes (SSE), previews en vivo, assets y checkpoints.
- `docs/agent-orchestration.md` (v1.1.0): runtime de IA (Cursor Agent SDK local / cloud / mock), composición del prompt (PromptBuilder), guarda de gates antes y después del run (GateGuard) y `allowed_paths` por agente y modo.
- `docs/iteration-environment-spec.md` (v1.1.0): scripts de iteración en Node ESM (`wika-dev.mjs`, `wika-verify.mjs`, `wika-build-artifact.mjs`) multiplataforma; contrato de `PREVIEW_URL` y marco de dispositivo.
- `workflows/exploration-vs-construction.md` (v1.1.0): reglas del chat en vivo por modo.
- `bootstrap/wika-studio/`: UI-B (workspace con chat de agentes, preview en vivo con simulador de dispositivo, assets, checkpoints) y BFF con auth de dueños, `@cursor/sdk`, PreviewManager, GateGuard y plantillas `expo-prototype` / `web-prototype`.
- Runbook Windows de Studio: `bootstrap/wika-studio/docs/windows-runbook.md` (sync desde fundaments, `.env` UTF-8, BFF sin `tsx watch`, preview Expo + `expo-asset`).

- Especificación **WIKA Studio**: visión, PRD, API lógica, orquestación de agentes, entorno de iteración, eventos de auditoría.
- Workflows `process-engine.md` y `exploration-vs-construction.md`.
- Charters `repositorio-proyectos.md`, `repositorio-wika-studio.md`, `proyecto-referencia.md`.
- `schemas/01–05` JSON Schema, `standards/solution-types.md`, `standards/coding-standards-web.md`.
- `scripts/validate_project.py`, spec, fixtures y tests.
- Gate organizacional `ready_for_studio_implementation` en `ROADMAP.md` y [`docs/studio-readiness-checklist.md`](docs/studio-readiness-checklist.md).
- Plantillas 01/04/05: `solution_type`, canales, modos, web y prototype.
- Sección modos en `.cursorrules`; repo `wika-studio` en `docs/repositories.md`.

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
