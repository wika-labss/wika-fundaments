---
id: "WIKA-STUDIO-API"
title: "Contrato API lógica — WIKA Studio"
status: "ACTIVO"
version: "1.0.0"
owner: "Arquitectura WIKA"
created_at: "2026-10-27"
updated_at: "2026-10-27"
---

# Contrato API lógica — WIKA Studio

## Objetivo

Especificar la **API REST lógica** del BFF de WIKA Studio (sin implementación). Permite desarrollar frontend y backend en paralelo contra contratos estables.

## Audiencia

Equipos `wika-studio`.

## Fuente de verdad

Estados: [`process-engine.md`](../workflows/process-engine.md).  
Jobs: [`agent-orchestration.md`](agent-orchestration.md).  
Eventos: [`audit-event-schema.md`](audit-event-schema.md).

## Relación con lifecycle y agentes

Endpoints de aprobación solo disponibles para rol `arquitecto`. Endpoints `jobs` delegan en orquestación de agentes.

## Fuera de alcance

OpenAPI generado, auth OIDC, WebSockets (v2).

---

# Convenciones

- Base path: `/api/v1`
- `project_id`: kebab-case, coincide con `proyectos/app/{project_id}/`
- Errores: `{ "error": { "code": "...", "message": "..." } }`
- Paginación: `?cursor=` en listas

---

# Proyectos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/projects` | Lista proyectos |
| POST | `/projects` | Body: `{ "project_id", "project_mode" }` → encola `bootstrap_project` |
| GET | `/projects/{id}` | Metadatos + flags agregados |
| GET | `/projects/{id}/tree` | Árbol de archivos (depth limit) |
| GET | `/projects/{id}/state` | `{ state_id, suggested_agent, flags, mode }` |

---

# Documentos idea

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/projects/{id}/idea/{doc}` | `doc` ∈ `01-problem` … `05-build-plan` (slug) |
| PATCH | `/projects/{id}/idea/{doc}` | Body: `{ "content": "..." }`; valida schema |
| POST | `/projects/{id}/validate` | Ejecuta validate_project; emite `validation.run` |

---

# Gates (humano)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/projects/{id}/gates/{gate}/request` | `gate` ∈ `gate_1`, `gate_2`, `gate_3a`, `gate_3b`, `release` |
| POST | `/projects/{id}/gates/{gate}/approve` | Body: `{ "artifact_refs", "preview_evidence?" }`; rol arquitecto |
| POST | `/projects/{id}/gates/{gate}/reject` | Body: `{ "reason" }` |

Efecto: actualizar markdown en Git (`audits/`, frontmatter flags).

---

# Jobs (agentes)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/projects/{id}/jobs` | Body: `{ "agent_id", "job_type", "params" }` |
| GET | `/projects/{id}/jobs/{job_id}` | Estado job |
| GET | `/projects/{id}/jobs` | Historial filtrable |

---

# Iteraciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/projects/{id}/iterations` | Lista `v1`, `v2`, `prototype` |
| POST | `/projects/{id}/iterations/{name}/environment` | Devuelve URLs/comandos según [`iteration-environment-spec.md`](iteration-environment-spec.md) |
| GET | `/projects/{id}/iterations/{name}/logs` | Tail de logs (implementación TBD) |

---

# Eventos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/projects/{id}/events` | Timeline [`audit-event-schema.md`](audit-event-schema.md) |

---

# Modo

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/projects/{id}/mode/promote` | exploration → construction; rol arquitecto |

---

# Documentos relacionados

- [`studio-product-spec.md`](studio-product-spec.md)
- [`repositorio-wika-studio.md`](repositorio-wika-studio.md)
