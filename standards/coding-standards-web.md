---
id: "WIKA-CODING-WEB"
title: "Estándares de código web V1"
status: "ACTIVO"
version: "1.0.0"
owner: "Arquitectura WIKA"
created_at: "2026-10-27"
updated_at: "2026-10-27"
---

# Estándares de código web V1

## Objetivo

Definir stack, verify y release para soluciones con canal **web** (`web_app`, `hybrid`) en WIKA Studio.

## Audiencia

Agentes builder/refiner, arquitectos.

## Fuente de verdad

Principios WIKA-ARCH: [`coding-standards.md`](coding-standards.md).  
Tipos: [`solution-types.md`](solution-types.md).

## Relación con lifecycle y agentes

Aplica cuando `delivery_channels` incluye `web`. Gate Release exige verify web documentado en 05.

## Fuera de alcance

Hosting productivo (infra repo); solo artefacto build.

---

# Stack web V1 (recomendado)

| Capa | Tecnología |
|------|------------|
| Framework | Vite + React 18 + TypeScript |
| Routing | react-router o file-based documentado en 04 |
| Estado | Zustand (si aplica) |
| Estilos | Tokens desde `theme.ts` / design-system base |
| Target V1 | Static build (`dist/`) |

Alternativa permitida si se documenta en 05: Next.js App Router (mismo pin `~` en deps críticas).

---

# Estructura

```text
iterations/vN/
├── src/
│   ├── engine/          # sin imports de React
│   ├── components/
│   └── routes/
├── public/
├── scripts/
│   ├── wika-dev.sh
│   ├── wika-verify.sh
│   └── wika-build-artifact.sh
└── package.json
```

---

# Verify

`wika-verify.sh` debe ejecutar como mínimo:

```bash
npm run typecheck
npm run test --if-present
npm run build
```

---

# Release web

Auditoría release valida:

- BDD críticos cubiertos en UI.
- `dist/` reproducible desde CI.
- Sin secretos en bundle.

Artefacto en `final/`: carpeta `web/` o zip según 05.

---

# Cuándo usar Expo Web vs web_app

| Caso | Elección |
|------|----------|
| Mismo repo que Android, UI compartida | Expo web + canal `android`+`web` |
| Producto solo navegador | `solution_type: web_app` + Vite |

Documentar elección en `04-application-design.md`.

---

# Documentos relacionados

- [`iteration-environment-spec.md`](../docs/iteration-environment-spec.md)
- [`coding-standards.md`](coding-standards.md)
