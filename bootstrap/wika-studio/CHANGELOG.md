# Changelog

## 0.2.0 — 2026-10-27

### Added

- Auth de dueños (`STUDIO_OWNERS` + cookie HttpOnly). Extraños reciben 403.
- Runtime de agentes: `@cursor/sdk` local o `mock`. Selector de modelo (`GET /models`).
- Chat SSE con `wika-scribe` / `designer` / `builder` / `refiner` / `auditor`. PromptBuilder + GateGuard.
- PreviewManager + plantillas `expo-prototype` y `web-prototype` (scripts Node `wika-dev.mjs`).
- DeviceFrame (iPhone / Android / tablet / escritorio), AssetPanel, IterationTimeline.
- Checkpoints git y eventos `.wika/events.jsonl`.
- Flujo «Nuevo proyecto» (bootstrap de idea/ + prototype).
- Node 22.13+, `concurrently` para `npm run dev` en Windows.
- `scripts/write-owner-env.mjs` y `scripts/sync-wika-studio.ps1 -Email -Password` (UTF-8, sin TTY).
- Runbook Windows: `docs/windows-runbook.md`.

### Fixed

- Login 500 en Windows: `.env` UTF-16/BOM y hash scrypt mal pegado (401, no 500).
- BFF mudo: `tsx watch` y carga eager de `@cursor/sdk`. `dev` es `tsx src/index.ts`; boot lazy.
- Preview Expo mudo o `code=1`: se lanza el CLI local (sin `npx.cmd`/`shell:true`); listo por HTTP; `expo-asset` se instala si falta.
- `GET /models` con key Cursor inválida → 502, no tumba la sesión.

## 0.1.0 — 2026-10-27

### Added

- Monorepo scaffold: `apps/web`, `apps/bff`, `packages/wika-client`.
- BFF stub API v1 (`GET /projects`, `GET /projects/:id/state`, `POST /projects/:id/validate`).
- UI-A inicial: lista de proyectos y panel de estado.
