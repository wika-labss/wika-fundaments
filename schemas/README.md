# Schemas

Esquemas JSON Schema para frontmatter y metadatos parseables de los documentos oficiales `idea/01–05`.

## Objetivo

Permitir validación en WIKA Studio (P-04) y en [`validate_project`](../docs/validate-project-spec.md) sin reinterpretar las plantillas en [`templates/`](../templates/).

## Uso

```bash
# Validación de proyecto (incluye frontmatter cuando se implementa en validate_project)
python3 scripts/validate_project.py --project tests/fixtures/sample-project/gold
```

## Archivos

| Schema | Plantilla |
|--------|-----------|
| [`01-problem.schema.json`](01-problem.schema.json) | `templates/01-problem.md` |
| [`02-features.schema.json`](02-features.schema.json) | `templates/02-features.md` |
| [`03-module-discovery.schema.json`](03-module-discovery.schema.json) | `templates/03-module-discovery.md` |
| [`04-application-design.schema.json`](04-application-design.schema.json) | `templates/04-application-design.md` |
| [`05-build-plan.schema.json`](05-build-plan.schema.json) | `templates/05-build-plan.md` |

## Fuente de verdad

Contenido narrativo y tablas RTM completas siguen en Markdown; los schemas validan **frontmatter YAML** y enums críticos.

## Documentos relacionados

- [`docs/studio-api-contract.md`](../docs/studio-api-contract.md)
- [`standards/solution-types.md`](../standards/solution-types.md)
