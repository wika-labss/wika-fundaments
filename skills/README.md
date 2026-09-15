# Skills WIKA

Skills Cursor (`SKILL.md`) 1:1 con el catálogo de [`agents/`](../agents/README.md). Anatomía según el skill creator: frontmatter `name` + `description` (siempre en contexto); cuerpo corto (se carga al disparar); ficha de agente como referencia bajo demanda.

## Principios

- **Conciso:** el cuerpo no duplica plantillas ni auditorías; apunta a `templates/`, `docs/` y `agents/`.
- **Libertad baja** en flags YAML y veredictos: la IA nunca escribe `true` ni **APROBADO**.
- **Libertad media** al rellenar docs y código, dentro de RTM / WIKA-ARCH.

## Índice

| Skill | Dispara cuando… |
|-------|-----------------|
| [wika-orchestrator](wika-orchestrator/SKILL.md) | Empieza o retoma un flujo WIKA y hay que elegir agente |
| [wika-bootstrap](wika-bootstrap/SKILL.md) | Proyecto nuevo: carpetas + plantillas |
| [wika-scribe](wika-scribe/SKILL.md) | Rellenar `idea/` 01–03 o 05 |
| [wika-auditor](wika-auditor/SKILL.md) | Borrador de auditoría / gaps |
| [wika-designer](wika-designer/SKILL.md) | `04-application-design.md` y wireframe |
| [wika-builder](wika-builder/SKILL.md) | Construcción V1 con gates en `true` |
| [wika-refiner](wika-refiner/SKILL.md) | Nueva iteración desde `review.md` |
| [wika-packager](wika-packager/SKILL.md) | `final/` tras Release APROBADO |

## Cursor

Copia o enlaza esta carpeta a `.cursor/skills/` del workspace (o del repo `proyectos`) para que el agente las descubra:

```bash
mkdir -p .cursor/skills
ln -s ../../skills/wika-orchestrator .cursor/skills/wika-orchestrator
# repetir por cada skill/
```

En este repositorio los enlaces viven en `.cursor/skills/`.

## Ruta canónica

`proyectos/app/{proyecto}/`
