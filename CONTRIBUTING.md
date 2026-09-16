# Contributing

## Alcance

Este repositorio define el flujo documental y de diseño para **sitios web** WIKA.

Antes de contribuir, confirma que el cambio pertenece aquí y no a `proyectos`, `wika-fundaments` o `design-system`.

## Reglas

1. Seguir `docs/documentation.md` y `workflows/application-lifecycle.md`.
2. Usar nombres en kebab-case para archivos Markdown.
3. Actualizar el README de la carpeta afectada cuando se agregue o mueva contenido.
4. Registrar cambios relevantes en `CHANGELOG.md`.
5. No introducir sitios de cliente ni código de negocio en este repositorio.
6. Ruta canónica de producto: `proyectos/web/{proyecto}/` (nunca `applications/`).
7. Tras cambiar docs, templates, standards o workflows, ejecutar:

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
04-html-design.md
05-build-plan.md
```

`sku` solo `A` o `B` en 01 y 02 (deben coincidir). `audit_2_passed` solo en 03. `audit_3_passed` en 04. `ready_for_construction` en **05**.

