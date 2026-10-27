---
id: "WIKA-MODES-EXP-CON"
title: "Modos Exploración vs Construcción"
status: "ACTIVO"
version: "1.0.0"
owner: "Arquitectura WIKA"
created_at: "2026-10-27"
updated_at: "2026-10-27"
---

# Modos Exploración vs Construcción

## Objetivo

Permitir **prototipos rápidos** (preview, iteración en sandbox) sin debilitar los gates que protegen `final/` y publicación en modo **Construcción**.

## Audiencia

Negocio, arquitectos, agentes IA, implementadores de Studio.

## Fuente de verdad

Flag `project_mode` en [`templates/01-problem.md`](../templates/01-problem.md).  
Gates oficiales: [`.cursorrules`](../.cursorrules).  
Estados: [`process-engine.md`](process-engine.md).

## Relación con lifecycle y agentes

En **Construcción**, aplica el lifecycle completo. En **Exploración**, se acorta la preparación documental y se limita el código a rutas sandbox; `wika-builder` solo escribe bajo `iterations/prototype/` (o convención acordada).

## Fuera de alcance

Eliminar auditorías en producción; bypass de Release.

---

# Valores de `project_mode`

| Valor | Descripción |
|-------|-------------|
| `exploration` | Prototipo desechable o pre-compromiso |
| `construction` | Producto oficial v1+ hacia `final/` |

Cambio `exploration` → `construction` requiere decisión de Arquitecto y completar gates pendientes antes de `iterations/v1/` oficial.

---

# Rutas de código

| Modo | Paths editables por IA | Prohibido |
|------|------------------------|-----------|
| exploration | `iterations/prototype/**` | `final/`, flags `ready_for_construction: true` sin gates |
| construction | `iterations/vN/**` solo si gates cumplidos | `prototype/` como sustituto de release |

Convención sandbox:

```text
proyectos/app/{proyecto}/iterations/prototype/
├── app/
├── src/
├── package.json
└── README.md          # alcance limitado del prototipo
```

---

# Gates en Exploración

| Gate lifecycle | Exploración | Construcción |
|----------------|-------------|--------------|
| Gate 1 | Recomendado; no bloquea prototype si 01–02 borrador | Obligatorio |
| Gate 2 | Opcional hasta promoción | Obligatorio |
| Gate 3A | **Recomendado** antes de preview público | Obligatorio |
| Gate 3B / ready | No requerido para prototype | Obligatorio para v1 |
| Release | N/A | Obligatorio para `final/` |

**Regla fija:** `final/` y publicación **siempre** exigen `project_mode: construction` y Release **APROBADO**.

---

# Estados Exploración (sub-máquina)

| state_id | Condición |
|----------|-----------|
| E01 | `project_mode: exploration`, 01 borrador |
| E02 | 01–02 mínimos (problema + 1 FEAT) |
| E03 | `iterations/prototype/` existe |
| E04 | Gate 3A opcional aprobado (preview compartido) |
| E05 | Solicitud promoción a construction |

Transición E05 → S01 construction: Arquitecto confirma y resetea path a flujo completo.

---

# Studio

- Badge visible: **Exploración** vs **Construcción**.
- Botón “Promover a construcción” dispara checklist de gates faltantes.
- Preview (UI-B) prioriza `iterations/prototype/` en modo exploration.

---

# Agentes

| Agente | Exploración | Construcción |
|--------|-------------|--------------|
| wika-designer | Wireframe + preview refs | 04 completo |
| wika-builder | Solo `prototype/` | v1+ con `ready_for_construction` |
| wika-packager | **Prohibido** | Tras release |

---

# Documentos relacionados

- [`process-engine.md`](process-engine.md)
- [`application-lifecycle.md`](application-lifecycle.md)
- [`iteration-environment-spec.md`](../docs/iteration-environment-spec.md)
