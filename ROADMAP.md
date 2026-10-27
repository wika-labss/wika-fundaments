# Roadmap

```yaml
ready_for_studio_implementation: true
```

## Ahora

- Mantener alineados workflows, templates, docs, standards y `agents/`.
- Especificación WIKA Studio completa — ver [`docs/studio-readiness-checklist.md`](docs/studio-readiness-checklist.md).
- Migrar proyectos existentes a plantillas v2.1+ (`solution_type`, modos) bajo demanda.

## Siguiente

- Crear repositorio **`wika-studio`** e implementar UI-A (consola operativa) según [`docs/studio-product-spec.md`](docs/studio-product-spec.md).
- Formalizar el repositorio `proyectos` en remoto (`proyectos/app/{proyecto}/`) y proyecto referencia ([`docs/proyecto-referencia.md`](docs/proyecto-referencia.md)).
- Generar skills Cursor (`SKILL.md`) 1:1 con cada ficha de `agents/` (`future_skill`).

## Tramos hacia Studio completo

| Tramo | Entregable |
|-------|------------|
| T0 | Fundaments estables + gate `ready_for_studio_implementation` |
| T1 | Repo `proyectos` + gold path referencia |
| T2 | Skills / CLI agentes |
| T3 | Motor proceso + `validate_project` en producción |
| T4 | UI-A consola (`wika-studio`) |
| T5 | UI-B preview / workspace |
| T6 | Multi-canal web + app en Studio |

Ver [`docs/vision-wika-studio.md`](docs/vision-wika-studio.md).
