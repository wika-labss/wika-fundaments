# ADR 001 — Monorepo stack

## Estado

Aceptado — 2026-10-27

## Contexto

Charter en wika-fundaments `docs/repositorio-wika-studio.md`.

## Decisión

- npm workspaces
- Frontend: Vite + React 18 + TypeScript
- BFF: Express 4 + TypeScript (Node 20)
- Tipos compartidos en `@wika-studio/wika-client`

## Consecuencias

- Un solo `npm install` en raíz
- BFF lee `proyectos` vía `WIKA_PROYECTOS_ROOT` (filesystem Git local)
