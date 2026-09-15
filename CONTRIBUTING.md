# Contributing

## Alcance

Este repositorio define el sistema operativo de desarrollo WIKA.

Antes de contribuir, confirma que el cambio pertenece aquí y no a `proyectos`, `platform` u otro repositorio oficial.

## Reglas

1. Seguir `docs/documentation.md` y `docs/repositories.md`.
2. Usar nombres en kebab-case para archivos Markdown.
3. Actualizar el README de la carpeta afectada cuando se agregue o mueva contenido.
4. Registrar cambios relevantes en `CHANGELOG.md`.
5. No introducir aplicaciones ni código de negocio en este repositorio.
6. Tras cambiar docs, templates, standards o workflows, ejecutar:

```bash
python3 scripts/validate_docs.py
python3 -m unittest tests.test_validate_docs
```

## Convención de plantillas

Las plantillas oficiales viven en `templates/` con numeración:

```text
01-problem.md
02-features.md
03-module-discovery.md
04-application-design.md
05-build-plan.md
```
