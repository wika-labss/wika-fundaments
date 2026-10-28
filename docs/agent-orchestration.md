---
id: "WIKA-AGENT-ORCH"
title: "Orquestación de agentes WIKA"
status: "ACTIVO"
version: "1.1.0"
owner: "Arquitectura WIKA"
created_at: "2026-10-27"
updated_at: "2026-10-27"
---

# Orquestación de agentes WIKA

## Objetivo

Mapear **jobs** invocables desde WIKA Studio (o CI) a las fichas en [`agents/`](../agents/README.md): inputs, outputs, prohibiciones, handoff y skill Cursor futura (`future_skill`).

## Audiencia

BFF `wika-studio`, operadores de agentes, implementadores de skills.

## Fuente de verdad

Fichas: [`agents/*.md`](../agents/README.md).  
Estados: [`process-engine.md`](../workflows/process-engine.md).  
Eventos: [`audit-event-schema.md`](audit-event-schema.md).

## Relación con lifecycle y agentes

Un **job** es una invocación acotada de un agente con `project_id` y parámetros. No sustituye la aprobación humana en gates.

## Fuera de alcance

Cola distribuida, multi-tenant, facturación por cliente.

---

# Runtime de IA

Los agentes WIKA son **fichas** (rol, inputs, outputs, prohibiciones). La inteligencia la aporta un **runtime** externo al que el BFF de Studio le entrega un prompt compuesto. El runtime oficial v1 es el **Cursor Agent SDK** (`@cursor/sdk`); la misma cuenta de Cursor de los dueños provee los modelos.

| Modo | Cuándo | Cómo |
|------|--------|------|
| `local` | Iteración en vivo (UI-B): prototipos, documentos idea, auditorías borrador | `Agent.create({ apiKey, model: { id }, local: { cwd } })` con `cwd` = carpeta permitida del proyecto en disco. El agente edita archivos; el dev server recarga el preview. |
| `cloud` | Trabajos largos sobre el repo remoto `proyectos` (p. ej. `build_v1`) | `POST /v1/agents` con `repos[].url`, `startingRef` y `autoCreatePR: true`. Requiere GitHub App de Cursor en la organización. Fase posterior. |
| `mock` | Desarrollo y pruebas de Studio sin API key | Runtime simulado que emite los mismos eventos y realiza ediciones deterministas. Nunca en producción. |

Reglas del runtime:

- La API key vive solo en el servidor del BFF (`CURSOR_API_KEY`). El navegador nunca la recibe.
- El modelo se elige por sesión desde el catálogo del runtime (`GET /models` en [`studio-api-contract.md`](studio-api-contract.md)). El dueño puede fijar un modelo por defecto.
- Un run por sesión a la vez. Mensajes nuevos mientras hay run activo reciben `SESSION_BUSY`.
- El BFF registra `job.started` / `job.completed` con `agent_id`, `model_id`, uso de tokens y duración ([`audit-event-schema.md`](audit-event-schema.md)).

## Composición del prompt (PromptBuilder)

Cada run recibe, en este orden:

1. **Identidad y límites:** nombre del agente, ruta permitida (`allowed_paths`) y lista `Forbidden` de la ficha `agents/{agent_id}.md`.
2. **Reglas globales:** contenido de [`.cursorrules`](../.cursorrules) (gates, stack, tokens).
3. **Ficha completa** del agente (`agents/{agent_id}.md`).
4. **Estado del proyecto:** `project_mode`, `state_id`, flags, `solution_type`, `delivery_channels`.
5. **Documentos idea** relevantes al agente (`idea/01–05`, recortados a un tamaño máximo con aviso de truncado).
6. **Historial de la sesión** (lo mantiene el runtime; el BFF solo reenvía el nuevo mensaje en follow-ups).
7. **Mensaje del dueño** e imágenes adjuntas.

El prompt termina con una instrucción fija: *no modificar flags YAML de gates, no escribir fuera de la ruta permitida, reportar cambios realizados con rutas relativas.*

## Guarda de gates (GateGuard)

Se aplica en dos momentos:

| Momento | Verificación | Efecto si falla |
|---------|--------------|-----------------|
| Antes del run | Precondición del catálogo job ↔ agente (p. ej. `wika-builder` sobre `vN` exige `ready_for_construction: true`; `wika-packager` exige release APROBADO). | `GATE_BLOCKED`; no se invoca la IA. |
| Después del run | Diff del proyecto: todo archivo cambiado debe estar bajo `allowed_paths`; ningún flag de gate puede pasar a `true`; ninguna auditoría puede contener **APROBADO** nuevo. | Se revierten los archivos infractores al checkpoint previo y se emite `guard.violation`. El resto del run se conserva. |

`allowed_paths` por agente y modo:

| agent_id | exploration | construction |
|----------|-------------|--------------|
| `wika-bootstrap` | `proyectos/app/{p}/**` (solo creación) | igual |
| `wika-scribe` | `idea/**` | `idea/**` |
| `wika-auditor` | `audits/**` | `audits/**` |
| `wika-designer` | `idea/04-application-design.md`, `idea/assets/**` | igual |
| `wika-builder` | `iterations/prototype/**` | `iterations/vN/**` si `ready_for_construction` |
| `wika-refiner` | `iterations/prototype/**` | `iterations/vN+1/**` |
| `wika-packager` | prohibido | `final/**` tras release APROBADO |

La demo en vivo (botones, tipografía, íconos, imágenes, pantallas) la construye **`wika-builder`** en `iterations/prototype/`; `wika-designer` aporta wireframe y tokens en `04-application-design.md`, no código de pantallas (ver su ficha).

---

# Modelo de job

```json
{
  "job_id": "job_uuid",
  "agent_id": "wika-scribe",
  "project_id": "mi-app",
  "params": {
    "task": "complete_doc_03",
    "mode": "construction"
  },
  "status": "queued|running|succeeded|failed",
  "forbidden_override": false
}
```

`forbidden_override` debe ser siempre `false` en producción.

---

# Catálogo job ↔ agente

| agent_id | job_type (ejemplo) | Precondición | Output principal |
|----------|-------------------|--------------|------------------|
| `wika-bootstrap` | `bootstrap_project` | nombre kebab-case | estructura `proyectos/app/{p}/` |
| `wika-scribe` | `draft_01_02`, `draft_03`, `draft_05` | gates según doc | `idea/*.md` |
| `wika-auditor` | `draft_audit_gate_1` … `draft_audit_release` | docs de entrada | borrador en `audits/` |
| `wika-designer` | `draft_04`, `update_wireframe` | `audit_2_passed` | `04-application-design.md` |
| `wika-builder` | `build_v1`, `build_prototype` | `ready_for_construction` o mode exploration | `iterations/v1/` o `prototype/` |
| `wika-refiner` | `refine_vN` | release rechazado o review | `iterations/vN+1/` |
| `wika-packager` | `package_final` | release APROBADO | `final/` |

---

# Prohibiciones globales (todos los jobs)

- Escribir `audit_1_passed`, `audit_2_passed`, `visual_approval_passed`, `audit_3_passed`, `ready_for_construction` en `true`.
- Escribir **APROBADO** en auditorías sin rol Arquitecto.
- `wika-packager` si release no APROBADO.
- `wika-builder` en `iterations/v1/` si `ready_for_construction: false`.

---

# Handoff tras job exitoso

| agent_id | hands_off_to (human/IA) |
|----------|-------------------------|
| wika-bootstrap | wika-scribe |
| wika-scribe (01–02) | wika-auditor → Arquitecto |
| wika-auditor | Arquitecto o agente indicado en ficha |
| wika-designer | Arquitecto Gate 3A |
| wika-builder | wika-auditor (release) |
| wika-refiner | wika-auditor |
| wika-packager | Negocio (demo) |

---

# Cola y concurrencia

- Un job `build_*` activo por proyecto e iteración destino.
- Jobs de lectura (`draft_audit_*`) pueden paralelizarse con validación.
- Studio muestra `suggested_agent` del process-engine cuando no hay job en curso.

---

# future_skill

| agent_id | future_skill |
|----------|--------------|
| wika-bootstrap | `wika-bootstrap` |
| wika-scribe | `wika-scribe` |
| wika-auditor | `wika-auditor` |
| wika-designer | `wika-designer` |
| wika-builder | `wika-builder` |
| wika-refiner | `wika-refiner` |
| wika-packager | `wika-packager` |

Generación de archivos `SKILL.md` — fase T2; este documento es contrato previo.

---

# Documentos relacionados

- [`studio-api-contract.md`](studio-api-contract.md)
- [`agents/README.md`](../agents/README.md)
