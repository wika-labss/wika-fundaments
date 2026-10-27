---
id: "WIKA-REPO-STUDIO"
title: "Charter — repositorio wika-studio"
status: "ACTIVO"
version: "1.0.0"
owner: "Arquitectura WIKA"
created_at: "2026-10-27"
updated_at: "2026-10-27"
---

# Charter — repositorio wika-studio

## Objetivo

Definir el repositorio **`wika-studio`**: interfaz web + BFF que orquesta el SCOS WIKA. Separado de [`platform`](repositories.md) (libs compartidas) y de [`wika-fundaments`](../README.md) (reglas).

## Audiencia

Equipo de implementación UI/backend.

## Fuente de verdad

PRD: [`studio-product-spec.md`](studio-product-spec.md).  
API: [`studio-api-contract.md`](studio-api-contract.md).  
Readiness: [`studio-readiness-checklist.md`](studio-readiness-checklist.md).

## Relación con lifecycle y agentes

Studio **refleja** [`process-engine.md`](../workflows/process-engine.md) e invoca jobs de [`agent-orchestration.md`](agent-orchestration.md). No altera semántica de gates.

## Fuera de alcance

Contenido de reglas WIKA (PRs van a fundaments).

---

# Responsabilidad

| Contiene | No contiene |
|----------|-------------|
| Frontend consola + workspace | Plantillas 01–05 oficiales |
| BFF / API v1 | Código de negocio de apps en `proyectos` |
| Integración Git `proyectos` | Terraform (repo `infrastructure`) |
| Cliente runner local (dev) | Agentes como fichas (fundaments) |

---

# Stack sugerido (v1)

| Capa | Sugerencia | Notas |
|------|------------|-------|
| Frontend | React + TypeScript + Vite | UI-A consola + UI-B workspace (chat, preview, marco de dispositivo) |
| BFF | Node 22.13+ + TypeScript | Implementa contrato REST; exige Node 22 por `@cursor/sdk` |
| Auth | Allowlist de dueños (v1) | `STUDIO_OWNERS`; roles negocio/arquitecto en v2 |
| Git | CLI git | Source of truth y checkpoints en `proyectos/app/{proyecto}/` |
| Agentes | Cursor Agent SDK (`@cursor/sdk`) local; Cloud Agents API para `build_v1` | Ver [`agent-orchestration.md`](agent-orchestration.md) sección Runtime |
| Plantillas de iteración | `templates/expo-prototype`, `templates/web-prototype` | Copiadas por bootstrap a `iterations/prototype/` |

Ajustable en ADR dentro de `wika-studio/docs/` al iniciar código.

---

# Dependencias de fundaments

Versión pinneada de:

- [`process-engine.md`](../workflows/process-engine.md)
- [`schemas/`](../schemas/README.md)
- `scripts/validate_project.py` (copia o submodule)

---

# Definition of Done — UI v1 (UI-A)

Antes de iniciar UI-B (preview):

1. P-01 … P-08 del PRD operativos contra API mock o Git local.
2. Aprobación Gate 1 end-to-end en entorno dev con fixture [`proyecto-referencia.md`](proyecto-referencia.md).
3. Eventos emitidos según [`audit-event-schema.md`](audit-event-schema.md).
4. Tests e2e mínimos: listar proyecto, validar, rechazar approve sin rol arquitecto.

---

# Estructura sugerida del repo (al crear)

```text
wika-studio/
├── README.md
├── apps/
│   ├── web/          # frontend
│   └── bff/          # API
├── packages/
│   └── wika-client/  # SDK tipado del contrato
└── docs/
    └── adr/
```

---

# Estado del repositorio remoto

| Elemento | Ubicación |
|----------|-----------|
| Especificación SCOS (PRD, API, gates) | **`wika-fundaments`** rama `wika-fundaments-v2` (PR #10 mergeado) |
| Código UI/BFF (monorepo) | **`wika-labss/wika-studio`** rama `main` |
| Copia de publicación (bootstrap) | `bootstrap/wika-studio/` en **wika-fundaments** |

## Publicar en wika-studio

### Opción A — GitHub Actions (recomendado)

1. Crear PAT con acceso `contents:write` a `wika-studio`.
2. Añadir secret **`WIKA_STUDIO_PUSH_TOKEN`** en el repo `wika-fundaments`.
3. Ejecutar workflow **seed-wika-studio** (manual dispatch).

### Opción B — Push local

```bash
git clone https://github.com/wika-labss/wika-studio.git
rsync -av --delete bootstrap/wika-studio/ wika-studio/
cd wika-studio && git add -A && git commit -m "chore: import bootstrap UI-A" && git push
```

### Opción C — Script local con monorepo

```bash
bash scripts/bootstrap-wika-studio-github.sh
```

URL: **https://github.com/wika-labss/wika-studio**

---

# Documentos relacionados

- [`vision-wika-studio.md`](vision-wika-studio.md)
- [`repositorio-proyectos.md`](repositorio-proyectos.md)
