---
id: "WIKA-AUDIT-EVENT-SCHEMA"
title: "Esquema de eventos de auditoría y actividad"
status: "ACTIVO"
version: "1.0.0"
owner: "Arquitectura WIKA"
created_at: "2026-10-27"
updated_at: "2026-10-27"
---

# Esquema de eventos de auditoría y actividad

## Objetivo

Definir un formato **machine-readable** para el historial de un proyecto (timeline en WIKA Studio): gates, jobs de agentes, validaciones y cambios de flags aprobados por humanos.

## Audiencia

Backend `wika-studio`, integraciones CI.

## Fuente de verdad

Veredictos oficiales siguen en `proyectos/app/{proyecto}/audits/*.md`. Los eventos son **índice** o **réplica append-only**; no reemplazan las auditorías.

## Relación con lifecycle y agentes

Cada evento referencia `state_id` de [`process-engine.md`](../workflows/process-engine.md) y opcionalmente `agent_id` de [`agents/`](../agents/README.md).

## Fuera de alcance

Almacenamiento físico (JSONL en repo vs DB); se recomienda `proyectos/app/{p}/.wika/events.jsonl` en v1 Studio.

---

# Formato base (JSON)

```json
{
  "event_id": "evt_20261027T153000Z_001",
  "occurred_at": "2026-10-27T15:30:00Z",
  "project_id": "tower-defense",
  "type": "gate.approved",
  "actor": {
    "kind": "human",
    "role": "arquitecto",
    "subject_id": "user@example.com"
  },
  "payload": {
    "gate": "gate_1",
    "state_from": "S02",
    "state_to": "S03",
    "flags_updated": {
      "audit_1_passed": true
    },
    "artifact_refs": [
      "audits/auditoria-documentacion.md"
    ]
  },
  "correlation_id": "optional-job-or-pr-id"
}
```

---

# Tipos de evento (`type`)

| type | Descripción |
|------|-------------|
| `project.created` | Bootstrap completado |
| `document.updated` | Cambio en `idea/*.md` |
| `validation.run` | Resultado `validate_project` |
| `job.started` | Agente invocado |
| `job.completed` | Agente terminó (éxito/fallo) |
| `gate.approval_requested` | Solicitud a arquitecto |
| `gate.approved` | Arquitecto aprobó |
| `gate.rejected` | Arquitecto rechazó |
| `mode.promoted` | exploration → construction |
| `iteration.created` | Nueva carpeta vN o prototype |
| `release.submitted` | Builder entregó a release |
| `demo.approved` | Negocio aprobó demo |

---

# Actor

| kind | Uso |
|------|-----|
| `human` | Aprobaciones, ediciones manuales |
| `agent` | `agent_id` = `wika-builder`, etc. |
| `system` | CI, validadores |

**Prohibido:** evento `gate.approved` con `actor.kind: agent` para flags YAML.

---

# Payload por gate

| gate | Campos obligatorios en payload |
|------|--------------------------------|
| gate_1 | `artifact_refs` incluye `auditoria-documentacion.md` |
| gate_2 | `auditoria-modulos.md` |
| gate_3a | `preview_evidence` (URL o path captura) |
| gate_3b | `auditoria-ensamblado.md`, `ready_for_construction` |
| release | `auditoria-release-v1.md`, `verdict: APROBADO` |

---

# Validación

- `event_id` único por proyecto.
- `occurred_at` ISO-8601 UTC.
- `project_id` = segmento kebab-case de la ruta app.

---

# Documentos relacionados

- [`studio-api-contract.md`](studio-api-contract.md)
- [`agent-orchestration.md`](agent-orchestration.md)
