# Docs

Contiene documentación general de WIKA.

Aquí se almacenan guías, conceptos, decisiones, manuales y conocimiento corporativo que no pertenece a otra categoría específica.

La documentación debe mantenerse actualizada y ser considerada fuente oficial de referencia.

## Guías

| Documento | Audiencia | Contenido |
|-----------|-----------|-----------|
| [instructivo-nuevos-usuarios.md](instructivo-nuevos-usuarios.md) | Nuevos usuarios | Cómo comienza y finaliza el flujo WIKA |
| [documentation.md](documentation.md) | Todos | Reglas de documentación y fuente de verdad |
| [repositories.md](repositories.md) | Arquitectos | Reglas de repositorios y estructura de proyectos |
| [bug-fix-report.md](bug-fix-report.md) | Arquitectos | Informe de consistencia documental (2026-09-15) |

## Auditorías (pre-build)

| Documento | Gate | Bloquea |
|-----------|------|---------|
| [auditoria-documentacion.md](auditoria-documentacion.md) | `audit_1_passed` | Descubrimiento de módulos |
| [auditoria-modulos.md](auditoria-modulos.md) | `audit_2_passed` | Diseño de aplicación |
| [auditoria-ensamblado.md](auditoria-ensamblado.md) | `audit_3_passed` | Construcción V1 |

## Auditorías (post-build)

| Documento | Gate | Bloquea |
|-----------|------|---------|
| [auditoria-release-v1.md](auditoria-release-v1.md) | registro en `audits/auditoria-release-v1.md` | `final/` y publicación |

## Workflows

Ver [`../workflows/application-lifecycle.md`](../workflows/application-lifecycle.md) para el ciclo de vida completo.

La ruta canónica de un producto es `proyectos/app/{proyecto}/`.
