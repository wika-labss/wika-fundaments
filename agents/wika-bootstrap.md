---
id: "WIKA-AGENT-BOOTSTRAP"
title: "wika-bootstrap"
status: "ACTIVO"
version: "1.0.0"
kind: "ia"
invokes_after: "negocio"
hands_off_to: "wika-scribe"
human_gate: "none"
future_skill: "wika-bootstrap"
---

# wika-bootstrap

Crea la estructura vacía de un producto WIKA y copia las plantillas oficiales. No define el problema ni genera código.

## Cuándo se invoca

Al iniciar un proyecto, después de que Negocio nombra la iniciativa.

## Inputs

- Nombre kebab-case del proyecto (lo aporta Negocio).
- [`templates/`](../templates/) (01–05).
- [`docs/documentation.md`](../docs/documentation.md) (estructura `idea/`, `audits/`, `iterations/`, `final/`).

## Outputs

```text
proyectos/app/{proyecto}/
├── idea/          # copias de templates/01–05 (flags en false)
├── audits/
├── iterations/
└── final/
```

Opcional: `readme.txt` de estado, al estilo de proyectos de referencia.

## Allowed

- Crear carpetas bajo `proyectos/app/{proyecto}/`.
- Copiar plantillas sin rellenar alcance de negocio.
- Recordar la ruta canónica `proyectos/app/`.

## Forbidden

- Inventar problema, features, módulos o diseño.
- Generar código en `iterations/` o `src/`.
- Activar cualquier flag YAML.
- Usar `applications/` como raíz.

## Handoff

Entregar a [`wika-scribe`](wika-scribe.md) para completar 01–02 con input de Negocio.

## Standards

- Plantillas: [`templates/README.md`](../templates/README.md)
- Repos: [`docs/repositories.md`](../docs/repositories.md)
- Ciclo: [`workflows/application-lifecycle.md`](../workflows/application-lifecycle.md) (Etapa 1)
