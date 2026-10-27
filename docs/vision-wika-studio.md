---
id: "WIKA-VISION-STUDIO"
title: "Visión WIKA Studio"
status: "ACTIVO"
version: "1.0.0"
owner: "Arquitectura WIKA"
created_at: "2026-10-27"
updated_at: "2026-10-27"
---

# Visión WIKA Studio

## Objetivo

Describir el **north star** de WIKA Studio: la plataforma web que orquesta el SCOS WIKA (documentación, gates, agentes IA y iteraciones) para crear soluciones — apps móviles, juegos, web apps e híbridos — sin sustituir el flujo oficial definido en [`workflows/application-lifecycle.md`](../workflows/application-lifecycle.md).

## Audiencia

Negocio, arquitectos, diseño, ingeniería y equipos que implementarán el repositorio [`wika-studio`](repositorio-wika-studio.md).

## Fuente de verdad

- Proceso y gates: [`wika-fundaments`](../README.md) — templates, auditorías, [`.cursorrules`](../.cursorrules), [`agents/`](../agents/README.md).
- Productos: repositorio `proyectos`, ruta `proyectos/app/{proyecto}/`.
- Implementación UI: repositorio `wika-studio` (charter en [`repositorio-wika-studio.md`](repositorio-wika-studio.md)).

## Relación con lifecycle y agentes

WIKA Studio **no acorta** los quality gates de construcción oficial. Refleja el estado computable del motor en [`workflows/process-engine.md`](../workflows/process-engine.md), invoca jobs alineados a [`docs/agent-orchestration.md`](agent-orchestration.md) y registra aprobaciones humanas (Arquitecto) según [`agents/roles-humanos.md`](../agents/roles-humanos.md).

Los siete agentes IA nominales (`wika-bootstrap` … `wika-packager`) siguen siendo el motor de generación; la plataforma es **cockpit y orquestador**, no un generador opaco.

## Fuera de alcance

- Código de la interfaz (vive en `wika-studio`).
- Infraestructura cloud de sandboxes (fase posterior).
- Sustituir Git como almacén canónico de `idea/` e `iterations/` en la v1 documentada.

---

# North star en una frase

**WIKA Studio es la fábrica de software asistida por IA con interfaz gráfica, donde cada solución nace en documentación oficial, pasa por auditorías humanas, se construye por agentes nominales y evoluciona en entornos de preview hasta `final/` y publicación.**

---

# Principios del producto

| Principio | Implicación en Studio |
|-----------|------------------------|
| La documentación define el producto | Wizard y editores escriben los mismos `01–05` que [`templates/`](../templates/) |
| IA genera, arquitecto valida | La UI no puede poner `audit_*_passed: true` ni `ready_for_construction: true` |
| Todo debe repetirse | Misma máquina de estados para juegos, apps y web ([`standards/solution-types.md`](../standards/solution-types.md)) |
| Git es contrato | Studio lee/escribe paths canónicos bajo `proyectos/app/{proyecto}/` |

---

# Qué es WIKA Studio

- **Consola del lifecycle** — Idea → Publicación con semáforo de gates.
- **Orquestador de agentes** — Disparar `wika-scribe`, `wika-builder`, etc., con contexto del repo.
- **Panel de roles** — Negocio completa 01–02; Arquitecto aprueba gates; diseño evidencia Gate 3A.
- **Workspace de iteración** (fase T5 del roadmap) — Preview embebido, logs, artefactos por `iterations/vN/`.
- **Historial auditable** — Eventos según [`audit-event-schema.md`](audit-event-schema.md).

---

# Qué no es WIKA Studio

- Un “App Builder” sin RTM, BDD ni trazabilidad ERR → FEAT → MOD → VIEW.
- Un sustituto de Cursor para saltarse [`ready_for_construction`](../.cursorrules).
- El repositorio `platform` (libs compartidas para apps; ver [`repositories.md`](repositories.md)).
- Deploy automático a producción sin Auditoría de Release y `wika-packager`.

---

# Personas

| Persona | Necesidad | Studio responde |
|---------|-----------|-----------------|
| Negocio / Producto | Idea clara, ver avance | Wizard 01–02, estado de gates, demo |
| Arquitecto | Control de calidad | Cola de aprobaciones, checklists, flags |
| Diseño | Aprobación visual | Gate 3A con preview / capturas |
| Ingeniería / IA ops | Construir e iterar | Jobs builder/refiner, workspace vN |
| Stakeholder | Validar demo | Enlace a demo y `final/` |

---

# Tipos de solución (mismo carril)

Apps móviles (Expo/RN), juegos (engine + UI), aplicaciones web e híbridos comparten el flujo 01–05. La ramificación está en `solution_type` y `delivery_channels` (plantilla [`01-problem.md`](../templates/01-problem.md)) y en estándares [`coding-standards.md`](../standards/coding-standards.md) / [`coding-standards-web.md`](../standards/coding-standards-web.md).

---

# Modos de proyecto

| Modo | Uso | Documento |
|------|-----|-----------|
| **Exploración** | Prototipo rápido, sandbox | [`exploration-vs-construction.md`](../workflows/exploration-vs-construction.md) |
| **Construcción** | v1+, release, `final/` | [`application-lifecycle.md`](../workflows/application-lifecycle.md) |

Studio debe mostrar el modo activo; exploración **no** habilita `final/` ni publicación.

---

# Evolución por fases (referencia)

Ver [`ROADMAP.md`](../ROADMAP.md) — tramos T0 (fundaments) → T6 (multi-canal). Este documento fija el **destino**; el PRD en [`studio-product-spec.md`](studio-product-spec.md) acota el MVP de interfaz.

---

# Documentos relacionados

| Documento | Rol |
|-----------|-----|
| [`studio-product-spec.md`](studio-product-spec.md) | PRD y pantallas MVP |
| [`studio-readiness-checklist.md`](studio-readiness-checklist.md) | Gate organizacional antes de codificar UI |
| [`process-engine.md`](../workflows/process-engine.md) | Estados y transiciones |
| [`studio-api-contract.md`](studio-api-contract.md) | Contrato API lógica |
