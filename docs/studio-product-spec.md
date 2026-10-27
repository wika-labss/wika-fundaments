---
id: "WIKA-PRD-STUDIO"
title: "Especificación de producto — WIKA Studio"
status: "ACTIVO"
version: "1.0.0"
owner: "Producto / Arquitectura WIKA"
created_at: "2026-10-27"
updated_at: "2026-10-27"
---

# Especificación de producto — WIKA Studio

## Objetivo

Definir el **PRD** de WIKA Studio: capacidades por fase de UI, pantallas MVP, métricas de éxito y fuera de alcance, para que el equipo de [`wika-studio`](repositorio-wika-studio.md) implemente sin reinterpretar el SCOS.

## Audiencia

Diseño de producto, frontend, backend/BFF y arquitectura.

## Fuente de verdad

Visión: [`vision-wika-studio.md`](vision-wika-studio.md).  
Proceso: [`process-engine.md`](../workflows/process-engine.md), [`.cursorrules`](../.cursorrules).  
API lógica: [`studio-api-contract.md`](studio-api-contract.md).

## Relación con lifecycle y agentes

Cada pantalla mapea a una etapa o acción del lifecycle y, cuando aplica, a un **job** de [`agent-orchestration.md`](agent-orchestration.md). Ninguna acción de producto contradice los `forbidden` de [`agents/`](../agents/README.md).

## Fuera de alcance (v1 UI documentada)

- Editor visual drag-and-drop de componentes (sustituto de Figma).
- Multi-tenant enterprise, SSO corporativo completo.
- Sandboxes gestionados en cloud (v1 puede asumir runner local o CI adjunto).
- Generación de skills Cursor (fase T2 separada).

---

# Fases de entrega UI

## Fase UI-A — Consola operativa (MVP obligatorio)

**Objetivo:** Operar el flujo WIKA desde navegador **sin** preview embebido.

| ID | Pantalla | Descripción | API / agente |
|----|----------|-------------|--------------|
| P-01 | Lista de proyectos | Escaneo de `proyectos/app/*` | `GET /projects` |
| P-02 | Detalle proyecto | Árbol `idea/`, `audits/`, `iterations/` | `GET /projects/{id}/tree` |
| P-03 | Estado y gates | Semáforo derivado de process-engine | `GET /projects/{id}/state` |
| P-04 | Documentos idea | Ver/editar markdown 01–05 (validación schema) | `GET/PATCH /projects/{id}/idea/{doc}` |
| P-05 | Validar proyecto | Ejecutar `validate_project` | `POST /projects/{id}/validate` |
| P-06 | Invocar agente | Cola job con agent_id | `POST /projects/{id}/jobs` |
| P-07 | Aprobación gate | Solo rol Arquitecto; escribe `audits/` + flags | `POST /projects/{id}/gates/{gate}/approve` |
| P-08 | Historial | Timeline de eventos | `GET /projects/{id}/events` |

**Definition of Done UI-A:** Un arquitecto puede aprobar Gate 1 usando P-07; un operador puede lanzar `wika-scribe` vía P-06; P-05 falla si RTM incompleto en fixture.

## Fase UI-B — Workspace y preview (T5)

| ID | Pantalla | Descripción |
|----|----------|-------------|
| P-09 | Iteraciones | Lista `v1`, `v2`, `prototype` |
| P-10 | Workspace | Logs, comandos según [`iteration-environment-spec.md`](iteration-environment-spec.md) |
| P-11 | Preview embebido | iframe URL dev/preview |
| P-12 | Gate 3A evidencia | Adjuntar URL/capturas a `04-application-design.md` |

**DoD UI-B:** Proyecto referencia ([`proyecto-referencia.md`](proyecto-referencia.md)) muestra preview de al menos una iteración.

## Fase UI-C — Studio completo

Empaquetado (`wika-packager`), demo, publicación, multi-canal web+móvil en un mismo proyecto.

---

# Flujos de usuario (resumen)

```text
Negocio: P-01 → crear (bootstrap job) → P-04 (01–02) → solicitar Gate 1
Arquitecto: P-03 → P-07 Gate 1 → … → Gate 3B / ready_for_construction
Builder: P-06 wika-builder → P-09 v1 → P-05 verify
Refiner: P-06 wika-refiner → nueva vN
Release: P-06 auditor → P-07 release → packager job
```

---

# Requisitos no funcionales

| Área | v1 |
|------|-----|
| Autorización | RBAC mínimo: `negocio`, `arquitecto`, `operador` |
| Auditoría | Todo approve/job emite evento ([`audit-event-schema.md`](audit-event-schema.md)) |
| Consistencia | Validación contra [`schemas/`](../schemas/README.md) en guardado P-04 |
| Performance | Lista proyectos < 2s en portafolio < 100 apps (objetivo) |

---

# Métricas de éxito

| Métrica | Meta (6 meses post UI-A) |
|---------|--------------------------|
| Proyectos creados vía Studio sin scaffold manual | ≥ 80% |
| Gates aprobados con evidencia en `audits/` | 100% |
| Tiempo idea → `ready_for_construction` vs baseline Cursor | Medible; no regresión de calidad (0 bypass de flags) |
| Segundo proyecto referencia completado | ≥ 1 |

---

# Dependencias de implementación

Antes de codificar UI-A, debe cumplirse [`studio-readiness-checklist.md`](studio-readiness-checklist.md) en `wika-fundaments`.

Stack sugerido para `wika-studio`: ver [`repositorio-wika-studio.md`](repositorio-wika-studio.md).

---

# Documentos relacionados

- [`vision-wika-studio.md`](vision-wika-studio.md)
- [`studio-api-contract.md`](studio-api-contract.md)
- [`agent-orchestration.md`](agent-orchestration.md)
