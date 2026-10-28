# ADR 001 — Monorepo stack

## Estado

Aceptado — 2026-10-27 (actualizado Node 22 / UI-B)

## Contexto

Charter en wika-fundaments `docs/repositorio-wika-studio.md`. Runtime de IA: `docs/agent-orchestration.md`.

## Decisión

- npm workspaces
- Frontend: Vite + React 18 + TypeScript (UI-A consola + UI-B workspace)
- BFF: Express 4 + TypeScript, **Node 22.13+** (`@cursor/sdk` exige este piso)
- Tipos compartidos en `@wika-studio/wika-client`
- IA: `@cursor/sdk` en modo local; fallback `mock` si no hay `CURSOR_API_KEY`
- Auth v1: allowlist `STUDIO_OWNERS` + cookie de sesión (dueños)
- Preview: proceso `node scripts/wika-dev.mjs` por iteración
- Checkpoints: commits git en el repo `proyectos`

## Consecuencias

- Un solo `npm install` en raíz
- `npm run dev` usa `concurrently` (Windows y Unix)
- BFF lee `proyectos` vía `WIKA_PROYECTOS_ROOT` y fundaments vía `WIKA_FUNDAMENTS_ROOT`
- La API key de Cursor nunca sale del BFF
