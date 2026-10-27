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
| Frontend | React + TypeScript + Vite | UI-A consola |
| BFF | Node 20 + TypeScript | Implementa contrato REST |
| Auth | RBAC simple (v1) | Roles: negocio, arquitecto, operador |
| Git | libgit2 / isomorphic-git / CLI git | Source of truth en `proyectos/app/{proyecto}/` |
| Agentes | Cursor API / subprocess skills | Según infra disponible |

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

# Creación del repositorio remoto

El scaffold v0.1 vive en el entorno de desarrollo en `wika-studio/` (git independiente, ignorado en este repo).

Desde una máquina con `gh` autenticado en la org **wika-labss**:

```bash
bash scripts/bootstrap-wika-studio-github.sh
```

URL esperada: **https://github.com/wika-labss/wika-studio**

Alternativa (import bundle sin carpeta local):

```bash
gh repo create wika-labss/wika-studio --public
git clone https://github.com/wika-labss/wika-studio.git
cd wika-studio
git pull /path/to/wika-studio-main.bundle main
git push origin main
```

---

# Documentos relacionados

- [`vision-wika-studio.md`](vision-wika-studio.md)
- [`repositorio-proyectos.md`](repositorio-proyectos.md)
