# WIKA Studio

Consola web y BFF para operar el [SCOS WIKA](https://github.com/wika-labss/wika-fundaments): proyectos en `proyectos/app/{proyecto}/`, gates, agentes e iteraciones.

**Especificación:** contratos y PRD en `wika-fundaments` (`docs/studio-product-spec.md`, `docs/studio-api-contract.md`).

## Requisitos

- Node.js 20+
- npm 10+
- Clone del repo [`proyectos`](https://github.com/wika-labss/proyectos) (o ruta local) — ver `WIKA_PROYECTOS_ROOT`

## Inicio rápido

```bash
npm install
# prepare compila @wika-studio/wika-client
export WIKA_PROYECTOS_ROOT=/path/to/proyectos   # opcional; default: fixtures/proyectos
npm run dev:bff   # terminal 1 — :3001
npm run dev:web   # terminal 2 — :5173
```

- Web: http://localhost:5173  
- BFF: http://localhost:3001/api/v1  

## Estructura

```text
apps/web/              # UI-A consola (React + Vite)
apps/bff/              # API v1 (Express + TypeScript)
packages/wika-client/  # Tipos compartidos del contrato
docs/adr/              # Decisiones de arquitectura
```

## Fase actual (UI-A)

Pantallas MVP: lista de proyectos, detalle, estado/gates, validación — ver PRD en fundaments.

## Licencia

Uso interno WIKA — ajustar según política de la organización.
