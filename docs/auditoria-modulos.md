# Auditoría de Módulos (web)

## Objetivo

Validar que el sitio fue descompuesto en módulos reutilizables (secciones, navegación, formularios, CMS si aplica) y que **MOD-DIR** dejó una dirección visual bloqueada.

---

# Entradas

- 01-problem.md
- 02-features.md
- 03-module-discovery.md
- `standards/sku-contract.yaml`

---

# Validaciones

## SKU

- `sku` de 03 coincide con 01 y 02 (`A` o `B`).
- Módulo de admin / CMS (`mod-admin`, `/admin`, magic link) **solo si `sku: A`**.
- Si `sku: B` y existe módulo de panel → `REQUIERE REVISIÓN`.

## Cobertura

- Toda funcionalidad tiene al menos un módulo asociado.
- No existen funcionalidades sin representación.

---

## Responsabilidad

Cada módulo debe cumplir:

- Una responsabilidad principal.
- Un objetivo claro.
- Un límite funcional definido.

---

## Duplicidad

- No existen módulos que resuelvan el mismo problema.
- No existen responsabilidades superpuestas.

---

## Dependencias

- Dependencias identificadas.
- Integraciones identificadas (WhatsApp, forms, Maps; CMS **solo A**).
- Riesgos identificados.

---

## MOD-DIR (dirección visual)

- Bloque YAML `mod_id: MOD-DIR` presente.
- `industry_type` alineado a `01-problem.md`.
- `direction_skill` es uno de: `minimalist-ui` | `high-end-visual-design` | `industrial-brutalist-ui`.
- `direction_skill` resuelto con `standards/direction-matrix.yaml` (no inventado).
- `direction_rationale` no vacío.
- `direction_locked: true` al aprobar.
- `forbidden_phase2_skills` incluye al menos `image-to-code`.

---

## Metadatos y trazabilidad

- Frontmatter YAML en `03-module-discovery.md` con `audit_1_passed: true` como pre-requisito.
- RTM modular: cada `MOD-XX` vinculado a `FEAT-XX` y `ERR-XX`.
- Contratos de módulo documentados (entradas, salidas, aislamiento).

---

## Activación de gate

Al aprobar, el arquitecto debe:

1. Registrar resultado en `audits/auditoria-modulos.md` del proyecto.
2. Cambiar `audit_2_passed: true` en frontmatter de `03-module-discovery.md`.

---

# Resultado

## APROBADO

Los módulos pueden avanzar al HTML estructural.

## REQUIERE REVISIÓN

Debe corregirse el descubrimiento de módulos.

---

# Regla

No se permite diseñar el HTML del sitio sin aprobar esta auditoría.
