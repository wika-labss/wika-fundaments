---
id: "WIKA-REPO-PROYECTOS"
title: "Charter — repositorio proyectos"
status: "ACTIVO"
version: "1.0.0"
owner: "Arquitectura WIKA"
created_at: "2026-10-27"
updated_at: "2026-10-27"
---

# Charter — repositorio proyectos

## Objetivo

Formalizar el repositorio **`proyectos`**: portafolio de productos WIKA, estructura canónica, convenciones y relación con WIKA Studio.

## Audiencia

Arquitectos, equipos de producto, implementadores Studio.

## Fuente de verdad

Reglas globales: [`repositories.md`](repositories.md).  
Plantillas: [`templates/`](../templates/).  
Validación: [`validate-project-spec.md`](validate-project-spec.md).

## Relación con lifecycle y agentes

Cada carpeta `app/{proyecto}/` es creada por `wika-bootstrap` y evoluciona según [`application-lifecycle.md`](../workflows/application-lifecycle.md).

## Fuera de alcance

Reglas SCOS (permanecen en `wika-fundaments`).

---

# Responsabilidad

| Contiene | No contiene |
|----------|-------------|
| `idea/`, `audits/`, `iterations/`, `final/` | Templates oficiales, `.cursorrules` |
| APK, builds web, evidencias | Infra Terraform |

Ruta canónica: `proyectos/app/{proyecto}/`.

---

# Estructura obligatoria por proyecto

```text
proyectos/app/{proyecto}/
├── idea/
│   ├── 01-problem.md
│   ├── 02-features.md
│   ├── 03-module-discovery.md
│   ├── 04-application-design.md
│   └── 05-build-plan.md
├── audits/
├── iterations/
│   ├── prototype/          # opcional, modo exploration
│   ├── v1/
│   └── vN/
├── final/
└── .wika/                  # opcional: events.jsonl (Studio)
    └── events.jsonl
```

---

# Convenciones

- `{proyecto}`: kebab-case, `[a-z0-9-]+`.
- Commits: preferir mensajes que referencien FEAT/MOD/VIEW cuando aplique.
- No duplicar documentos de `idea/` dentro de `iterations/`.

---

# CI sugerida (repo proyectos)

```yaml
# .github/workflows/wika-project-validate.yml (sugerido)
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate changed projects
        run: |
          pip install pyyaml  # si aplica
          python3 path/to/wika-fundaments/scripts/validate_project.py --root .
```

Pin de versión del script desde tag de `wika-fundaments`.

---

# Relación con WIKA Studio

- Studio clona o monta lectura/escritura Git de `proyectos`.
- API [`studio-api-contract.md`](studio-api-contract.md) opera sobre paths relativos a `app/{id}/`.
- Proyecto referencia: [`proyecto-referencia.md`](proyecto-referencia.md).

---

# Bootstrap

Invocar agente `wika-bootstrap` o equivalente job con nombre validado. Copia plantillas v2.1 desde `wika-fundaments/templates/`.

---

# Documentos relacionados

- [`repositorio-wika-studio.md`](repositorio-wika-studio.md)
- [`proyecto-referencia.md`](proyecto-referencia.md)
