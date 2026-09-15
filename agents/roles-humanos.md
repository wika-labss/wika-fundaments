---
id: "WIKA-ROLES-HUMANOS"
title: "Roles humanos del flujo WIKA"
status: "ACTIVO"
version: "1.0.0"
kind: "humano"
---

# Roles humanos

Complemento del catálogo IA. Estos roles **no** se implementan como agentes Cursor.

Ruta canónica: `proyectos/app/{proyecto}/`.

---

## Negocio / Producto

| Campo | Valor |
|-------|-------|
| Invoca | `wika-bootstrap` al iniciar un proyecto |
| Recibe de | `wika-packager` (artefactos en `final/`) y demo |
| Gate humano | Aceptación de demo y prioridad de alcance |

### Responsabilidades

- Define el problema, usuarios, prioridad y out-of-scope.
- Aporta contenido de negocio para `01-problem.md` y `02-features.md` (el `wika-scribe` lo estructura; no lo inventa).
- Valida el resultado en Demo y Publicación.

### Prohibido

- Pedir código en `iterations/` antes de `ready_for_construction: true`.
- Saltar auditorías.

---

## Arquitecto WIKA

| Campo | Valor |
|-------|-------|
| Recibe de | `wika-auditor` (borradores) y `wika-designer` (wireframe) |
| Entrega | Flags YAML, firmas y `review.md` |
| Gate humano | 1, 2, 3A, 3B, V1 (`ready_for_construction`), Release |

### Responsabilidades

- Ejecuta las auditorías oficiales (`docs/auditoria-*.md`) y registra el veredicto en `audits/`.
- Es el **único** autorizado a poner flags en `true` y a escribir **APROBADO**.
- En Gate 3A puede firmar junto con un stakeholder; no se crea un agente IA de stakeholder.
- Deja observaciones en `iterations/vN/review.md` para `wika-refiner`.

### Prohibido

- Delegar la aprobación de gates a cualquier agente IA.
- Activar `ready_for_construction` si algún flag previo está en `false`.

---

## Relación con agentes IA

```text
Negocio → define
IA      → genera / audita en borrador / construye
Arquitecto → aprueba o rechaza
```

Detalle operativo: [README.md](README.md).
