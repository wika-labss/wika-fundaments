---
id: "WIKA-AGENT-ORCH"
title: "Orquestación de agentes WIKA"
status: "ACTIVO"
version: "1.0.0"
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

Implementación del runner (Cursor Cloud Agent, cola Redis, etc.).

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
