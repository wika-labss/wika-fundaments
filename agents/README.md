# Agents

Catálogo nominativo de agentes del flujo WIKA (idea → publicación).

Cada agente IA tiene una ficha con inputs, outputs, prohibiciones y handoff. Ningún agente IA activa flags YAML ni firma auditorías: eso es exclusivo del [Arquitecto](roles-humanos.md).

**Ruta canónica de producto:** `proyectos/app/{proyecto}/`.

Las skills Cursor viven en [`skills/`](../skills/README.md) (`SKILL.md` 1:1 + orquestador). Cada ficha declara `future_skill` con el mismo ID.

---

## Cómo invocar

1. Ubicar la etapa en [`workflows/application-lifecycle.md`](../workflows/application-lifecycle.md).
2. Abrir la ficha de esta tabla.
3. Respetar `forbidden` y `human_gate`.
4. Entregar al `hands_off_to` indicado.

---

## Índice

| ID | Tipo | Etapa | Ficha |
|----|------|-------|-------|
| `wika-bootstrap` | IA | Idea / scaffolding | [wika-bootstrap.md](wika-bootstrap.md) |
| `wika-scribe` | IA | Preparación 01–05 | [wika-scribe.md](wika-scribe.md) |
| `wika-auditor` | IA | Gates 1, 2, 3B, Release (borrador) | [wika-auditor.md](wika-auditor.md) |
| `wika-designer` | IA | Diseño 04 + prep. Gate 3A | [wika-designer.md](wika-designer.md) |
| `wika-builder` | IA | Construcción V1 | [wika-builder.md](wika-builder.md) |
| `wika-refiner` | IA | Refinamiento vN | [wika-refiner.md](wika-refiner.md) |
| `wika-packager` | IA | `final/` post-release | [wika-packager.md](wika-packager.md) |
| Negocio | humano | Idea, 01–02, demo | [roles-humanos.md](roles-humanos.md) |
| Arquitecto | humano | Todos los gates | [roles-humanos.md](roles-humanos.md) |

Stakeholder visual = firma conjunta del Arquitecto en Gate 3A; no es un agente IA.

---

## Handoff resumido

```text
Negocio
  → wika-bootstrap
  → wika-scribe (01–02)
  → wika-auditor (Gate 1) → Arquitecto
  → wika-scribe (03)
  → wika-auditor (Gate 2) → Arquitecto
  → wika-designer (04)
  → Arquitecto (Gate 3A)
  → wika-scribe (05)
  → wika-auditor (Gate 3B) → Arquitecto
  → wika-builder (V1)
  → wika-auditor (Release) → Arquitecto
  → wika-refiner (si REQUIERE CORRECCIONES)
  → wika-packager (si APROBADO)
  → Negocio (demo / publicación)
```

---

## Regla de autoridad

```text
IA genera y prepara.
Arquitecto aprueba.
Negocio acepta el resultado.
```

Prohibido: `audit_*_passed: true`, `visual_approval_passed: true`, `ready_for_construction: true`, o veredicto **APROBADO** escritos por un agente IA.
