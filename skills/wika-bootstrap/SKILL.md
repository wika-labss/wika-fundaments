---
name: wika-bootstrap
description: Crea el scaffolding de un producto WIKA (carpetas idea/audits/iterations/final y copia de plantillas 01–05). Usar al iniciar un proyecto nuevo, clonar templates oficiales o cuando no existe proyectos/app/{nombre}/. No rellena alcance de negocio ni genera código.
---

# wika-bootstrap

Contrato: `agents/wika-bootstrap.md`. Handoff: `wika-scribe`.

## Procedimiento

1. Nombre kebab-case (Negocio). Raíz **solo** `proyectos/app/{proyecto}/`.
2. Crear `idea/`, `audits/`, `iterations/`, `final/`.
3. Copiar `templates/01-problem.md` … `05-build-plan.md` a `idea/` sin inventar contenido.
4. Dejar flags YAML en `false`.
5. Anunciar handoff a `wika-scribe` con input de Negocio.

## Prohibido

Inventar ERR/FEAT; código en `iterations/`; `applications/` como raíz; flags en `true`.
