# Auditoría de Ensamblado (web)

## Objetivo

Validar que el diseño HTML estructural y el plan de construcción permiten integrar los módulos **antes** de escribir HTML de producción (Fase 1), **sin violar el plan de negocio**.

---

# Entradas

- 03-module-discovery.md
- 04-html-design.md
- 05-build-plan.md
- `standards/sku-contract.yaml`

---

# Validaciones

## SKU y stack

- `sku` de 01, 02, 03, 04 y 05 coincide (`A` o `B`).
- `cms` en 05 es `false` si B y `true` si A.
- Stack de 05 = tabla canónica del contrato (Workers, Cloudflare for SaaS, D1, R2). No Vercel, VPS, WordPress, ni repo por cliente.
- SKU B: sin módulos CMS, sin `/admin`, sin magic link en 04/05.
- SKU A: panel de schema fijo; no admin custom infinito.
- Híbrido (“landing con un panel chico”) → `REQUIERE CORRECCIONES`.

---

## Arquitectura

- Arquitectura definida como **tenant** de la plataforma, no aplicación aislada.
- Componentes/secciones identificados.
- Integraciones documentadas.

---

## Módulos

- Todos los módulos de 03 están incorporados en 04.
- No existen módulos sin uso.
- No existen dependencias circulares.
- `mod-admin` presente **solo** si `sku: A`.

---

## Navegación

- Flujo principal definido.
- Estados definidos (vacío, error de form, éxito).
- Casos de uso cubiertos.

---

## Dirección visual

- `direction_skill` en `04-html-design.md` coincide con MOD-DIR en `03-module-discovery.md`.
- Pre-requisitos: `audit_1_passed`, `audit_2_passed` en `true`.
- `visual_approval_passed: true` (Gate 3A).

---

## Fase 1 vs Fase 2

- 04 describe HTML **semántico** (Fase 1), no el look final de taste-skill.
- Queda explícito que Fase 2 no arranca hasta `construction_phase_complete: true`.
- `ready_for_construction` se activa en **05**, no en 04.

---

## Activación de gates

Al aprobar ensamblado, el arquitecto debe:

1. Confirmar aprobación visual: `visual_approval_passed: true` en `04-html-design.md`.
2. Registrar ensamblado en `audits/auditoria-ensamblado.md`.
3. Cambiar `audit_3_passed: true` en `04-html-design.md`.
4. Cambiar `ready_for_construction: true` en `05-build-plan.md` cuando todos los flags previos sean `true`.

---

# Resultado

## APROBADO

Puede comenzar la Fase 1 (HTML semántico) respetando el SKU.

## REQUIERE CORRECCIONES

Debe corregirse el diseño o el plan antes de construir.

---

# Regla

No se permite generar HTML de producción sin aprobar esta auditoría ni construir un SKU distinto al de Gate 1.
