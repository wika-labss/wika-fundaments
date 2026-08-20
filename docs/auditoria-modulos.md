# Auditoría de Módulos

## Objetivo

Validar que la aplicación fue correctamente descompuesta en módulos reutilizables.

Esta auditoría busca asegurar que WIKA construye capacidades reutilizables antes que aplicaciones.

---

# Entradas

- 01-problem.md
- 02-features.md
- 03-module-discovery.md

---

# Validaciones

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
- Integraciones identificadas.
- Riesgos identificados.

---

## Reutilización

Se evaluó si existe:

- Módulo equivalente.
- Componente reutilizable.
- Solución previa.

---

## Metadatos y trazabilidad (plantillas v2.1)

- Frontmatter YAML en `03-module-discovery.md` con `audit_1_passed: true` como pre-requisito.
- RTM modular: cada `MOD-XX` vinculado a `FEAT-XX` y `ERR-XX`.
- Contratos de módulo documentados (entradas, salidas, aislamiento).
- Grafo de dependencias sin ciclos.
- Matriz de riesgos arquitectónicos presente.
- Evaluación de reutilización WIKA completada.

---

## Activación de gate

Al aprobar, el arquitecto debe:

1. Registrar resultado en `audits/auditoria-modulos.md` del proyecto.
2. Cambiar `audit_2_passed: true` en frontmatter de `03-module-discovery.md`.

---

# Resultado

## APROBADO

Los módulos pueden avanzar al diseño.

## REQUIERE REVISIÓN

Debe corregirse el descubrimiento de módulos.

---

# Regla

No se permite diseñar la aplicación sin aprobar esta auditoría.
