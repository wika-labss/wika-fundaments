# Auditoría de Documentación

## Objetivo

Validar que la documentación del proyecto contiene toda la información necesaria para iniciar el descubrimiento de módulos.

Ningún proyecto podrá avanzar a la etapa de descubrimiento de módulos sin aprobar esta auditoría.

---

# Entradas

## Obligatorias

- 01-problem.md
- 02-features.md

---

# Validaciones

## Problema

- El problema está claramente definido.
- Existe una necesidad real identificada.
- El alcance está documentado.

---

## Usuarios

- Los usuarios están identificados.
- Existe una descripción de uso esperada.

---

## Objetivo

- Existe un objetivo claro.
- Existe un resultado esperado.

---

## Funcionalidades

- Las funcionalidades obligatorias están definidas.
- Las funcionalidades opcionales están diferenciadas.
- El alcance está delimitado.

---

## Restricciones

- Restricciones técnicas identificadas.
- Restricciones operativas identificadas.
- Restricciones de seguridad identificadas.

---

## Metadatos y trazabilidad (plantillas v2.1)

- Frontmatter YAML presente en `01-problem.md` y `02-features.md` (`id`, `status`, `owner`, fechas).
- RTM inicial en `01-problem.md` con IDs `ERR-XX` mapeados a `FEAT-XX`.
- RTM en `02-features.md` con cobertura 1:1 hacia módulos destino.
- Criterios de éxito en formato BDD (Dado / Cuando / Entonces).
- Out-of-scope explícito documentado.
- Restricciones alineadas a `standards/coding-standards.md`.

---

## Activación de gate

Al aprobar, el arquitecto debe:

1. Registrar resultado en `audits/auditoria-documentacion.md` del proyecto.
2. Cambiar `audit_1_passed: true` en frontmatter de `01-problem.md` y `02-features.md`.

---

# Resultado

## APROBADO

La documentación permite continuar.

## REQUIERE CORRECCIONES

La documentación debe completarse antes de continuar.

---

# Regla

No se permite ejecutar el descubrimiento de módulos sin aprobar esta auditoría.
