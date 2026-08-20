# Auditoría de Ensamblado

## Objetivo

Validar que el diseño de la aplicación permite integrar correctamente los módulos definidos.

El objetivo es detectar problemas de arquitectura antes de escribir código.

---

# Entradas

- 03-module-discovery.md
- 04-application-design.md
- 05-build-plan.md

---

# Validaciones

## Arquitectura

- Arquitectura definida.
- Componentes identificados.
- Integraciones documentadas.

---

## Módulos

- Todos los módulos están incorporados.
- No existen módulos sin uso.
- No existen dependencias circulares.

---

## Navegación

- Flujo principal definido.
- Estados definidos.
- Casos de uso cubiertos.

---

## Build

- Estrategia de construcción definida.
- Dependencias externas identificadas.
- Riesgos técnicos documentados.

---

## Escalabilidad

- El diseño soporta crecimiento futuro.
- Los módulos mantienen independencia funcional.

---

## Diseño visual y ensamblado (plantillas v2.1)

- Navegación expo-router documentada en `04-application-design.md`.
- Wireframe o matriz preview ↔ componentes presente.
- Tokens/theme documentados o N/A justificado para proyectos sin UI significativa.
- `05-build-plan.md` coherente con módulos y diseño.
- Pre-requisitos: `audit_1_passed`, `audit_2_passed` en `true`.

---

## Activación de gates

Al aprobar ensamblado, el arquitecto debe:

1. Confirmar aprobación visual: `visual_approval_passed: true` en `04-application-design.md`.
2. Registrar ensamblado en `audits/auditoria-ensamblado.md`.
3. Cambiar `audit_3_passed: true` en `04-application-design.md`.
4. Cambiar `ready_for_construction: true` en `05-build-plan.md` cuando todos los flags previos sean `true`.

---

# Resultado

## APROBADO

Puede comenzar la construcción.

## REQUIERE CORRECCIONES

Debe corregirse el diseño antes de construir.

---

# Regla

No se permite generar código sin aprobar esta auditoría.
