---
id: "WIKA-STUDIO-API"
title: "Contrato API lógica — WIKA Studio"
status: "ACTIVO"
version: "1.1.0"
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
- Streaming: Server-Sent Events (`text/event-stream`) en rutas marcadas **SSE**. Cada evento lleva `event:` con el tipo y `data:` JSON.

---

# Autenticación (dueños de la cuenta)

Studio v1 es de **uso interno**: solo los dueños listados en la configuración del BFF (`STUDIO_OWNERS`) pueden entrar. No hay registro público.

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | Body: `{ "email", "password" }`. Si `email` está en la allowlist y la contraseña coincide, responde `{ "owner": { "email" } }` y fija cookie de sesión `HttpOnly`. |
| POST | `/auth/logout` | Invalida la cookie. |
| GET | `/auth/me` | `{ "owner": { "email" } }` o `401`. |

Reglas:

- Todas las rutas salvo `/health` y `/auth/*` exigen sesión válida; sin ella responden `401 UNAUTHORIZED`. Un email fuera de la allowlist recibe `403 FORBIDDEN` al intentar entrar.
- La credencial de la IA (`CURSOR_API_KEY`) vive solo en el BFF. Nunca se envía al navegador ni se expone por API.
- Por defecto el BFF escucha en `127.0.0.1`; exponerlo a red requiere decisión explícita del dueño.

---

# Modelos de IA

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/models` | `{ "models": [ { "id", "display_name", "description?" } ], "default_model_id" }` — catálogo que entrega el runtime de IA (ver [`agent-orchestration.md`](agent-orchestration.md), sección Runtime). |
| PUT | `/models/default` | Body: `{ "model_id" }`; guarda el modelo por defecto del dueño autenticado. |

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

# Sesiones (chat con agentes, UI-B)

Una **sesión** es una conversación persistente entre el dueño y un agente WIKA sobre un proyecto. Cada mensaje del dueño produce un **run** del agente (un job interactivo). El agente edita archivos del proyecto en disco; el preview los recarga.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/projects/{id}/sessions` | Lista sesiones del proyecto |
| POST | `/projects/{id}/sessions` | Body: `{ "agent_id", "model_id?", "iteration?" }` → `{ "session_id", "agent_id", "model_id", "iteration", "allowed_paths" }`. `iteration` por defecto: `prototype` en exploration, `vN` activa en construction. |
| GET | `/projects/{id}/sessions/{sid}` | Metadatos + historial de mensajes |
| POST | `/projects/{id}/sessions/{sid}/messages` | Body: `{ "text", "model_id?", "images?": [ { "name", "mime_type", "data_base64" } ] }` → `202 { "run_id" }`. `409 SESSION_BUSY` si hay run activo. |
| GET | `/projects/{id}/sessions/{sid}/stream` | **SSE**. Reemite historial y luego eventos en vivo. |
| POST | `/projects/{id}/sessions/{sid}/cancel` | Cancela el run activo |

Eventos SSE (`event:`):

| event | data |
|-------|------|
| `run.started` | `{ run_id, agent_id, model_id, prompt_summary }` |
| `assistant.delta` | `{ run_id, text }` — texto incremental |
| `assistant.message` | `{ run_id, text }` — mensaje completo |
| `tool.call` | `{ run_id, call_id, name, status, path? }` |
| `guard.violation` | `{ run_id, path, reason, action: "reverted" }` — ver [`agent-orchestration.md`](agent-orchestration.md) |
| `checkpoint.created` | `{ run_id, checkpoint_id, summary }` |
| `run.finished` | `{ run_id, status: "succeeded"\|"failed"\|"cancelled", usage?, duration_ms?, error? }` |

Reglas:

- Antes de cada run, el BFF aplica la **guarda de gates** (precondiciones de la ficha del agente y del modo del proyecto). Si falla, responde `409 GATE_BLOCKED` con `{ "missing_flag", "suggested_action" }` y no se invoca a la IA.
- Al terminar el run, el BFF revisa el diff. Archivos fuera de `allowed_paths` o flags YAML activados se revierten y se emite `guard.violation`.
- Cada run exitoso crea un checkpoint (ver abajo) y registra `job.started` / `job.completed` en el timeline.

---

# Iteraciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/projects/{id}/iterations` | Lista `v1`, `v2`, `prototype` |
| POST | `/projects/{id}/iterations/{name}/environment` | Devuelve URLs/comandos según [`iteration-environment-spec.md`](iteration-environment-spec.md) |
| GET | `/projects/{id}/iterations/{name}/logs` | Tail de logs (implementación TBD) |

---

# Previews (demo en vivo)

El BFF levanta y supervisa el servidor de desarrollo de una iteración según [`iteration-environment-spec.md`](iteration-environment-spec.md). El navegador carga `preview_url` dentro del marco de dispositivo.

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/projects/{id}/iterations/{name}/preview/start` | Instala dependencias si faltan y lanza `wika-dev`. → `{ "status", "preview_url?", "port" }` |
| GET | `/projects/{id}/iterations/{name}/preview` | `{ "status": "stopped"\|"installing"\|"starting"\|"ready"\|"error", "preview_url?", "port?", "started_at?", "last_error?" }` |
| POST | `/projects/{id}/iterations/{name}/preview/stop` | Detiene el proceso |
| GET | `/projects/{id}/iterations/{name}/preview/logs` | `{ "lines": [...] }` — tail de `.wika/logs/dev.log` |

Reglas:

- Un preview activo por iteración. Puertos asignados por el BFF dentro de un rango configurable.
- `preview_url` se toma de la línea `PREVIEW_URL=` que imprime el script `wika-dev`.
- Hot reload lo provee el dev server de la plantilla (Expo web o Vite); el BFF no reinicia el proceso entre runs del agente.

---

# Assets

Imágenes y archivos que el dueño aporta para la demo (logos, íconos, referencias).

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/projects/{id}/iterations/{name}/assets` | Lista `{ name, size_bytes, mime_type, url }` |
| POST | `/projects/{id}/iterations/{name}/assets` | Body: `{ "name", "mime_type", "data_base64" }`. Guarda en `iterations/{name}/assets/`. |
| DELETE | `/projects/{id}/iterations/{name}/assets/{name}` | Elimina el archivo |

Las imágenes adjuntas a un mensaje de sesión se guardan también como assets y se envían al modelo como imágenes del prompt.

---

# Checkpoints

Un checkpoint es un commit en el repo `proyectos` acotado a `app/{id}/`, creado tras cada run exitoso del agente o manualmente.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/projects/{id}/checkpoints` | Lista `{ checkpoint_id, created_at, agent_id?, model_id?, summary, files_changed }` (más reciente primero) |
| POST | `/projects/{id}/checkpoints` | Body: `{ "summary" }`; checkpoint manual |
| GET | `/projects/{id}/checkpoints/{cid}/diff` | `{ "stat": "...", "files": [...] }` |
| POST | `/projects/{id}/checkpoints/{cid}/restore` | Body: `{ "paths?": ["iterations/prototype"] }`. Restaura los paths al estado del checkpoint y crea un nuevo checkpoint `restore`. Nunca reescribe historial. |

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
