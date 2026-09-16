# Auditoría de Documentación (web)

## Objetivo

Validar que la documentación del sitio contiene toda la información necesaria para iniciar el descubrimiento de módulos, **incluido el SKU A o B del plan de negocio**.

Ningún proyecto web podrá avanzar a módulos sin aprobar esta auditoría.

---

# Entradas

## Obligatorias

- 01-problem.md
- 02-features.md
- Contrato: `standards/sku-contract.yaml`
- Tesis: `docs/plan-de-negocio-web/plan-de-negocio.md`

---

# Validaciones

## SKU A / B (plan de negocio)

- `sku` en frontmatter de 01 y 02 es exactamente `A` o `B` (no vacío, no `portfolio`, no híbrido).
- `sku` de 01 **coincide** con `sku` de 02. Mismatch → `REQUIERE CORRECCIONES`.
- `sku_rationale` no vacío en ambos.
- Rúbrica de clasificación completada en 01 (panel, contenido que cambia, reservas/pagos).
- Si `sku: B`: se cita la regla de oro (*esto no incluye panel*). Ninguna FEAT de 02 pide `/admin`, CMS ni magic link.
- Si `sku: A`: el alcance del panel es schema fijo del contrato, no admin custom infinito.
- Peticiones no-go (`forbidden_v1`: reservas, pagos, login de visitantes, WordPress, Vercel, repo por cliente) están en fuera de alcance, no en features obligatorias.

---

## Problema

- El problema está claramente definido.
- Existe una necesidad real identificada.
- El alcance está documentado.
- `industry_type` y `target_audience` presentes en frontmatter de `01-problem.md` (insumos de MOD-DIR).

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

- Las funcionalidades obligatorias están definidas (secciones, CTAs).
- Las funcionalidades opcionales están diferenciadas.
- El alcance está delimitado y cabe en `allowed` del SKU.

---

## Restricciones

- Restricciones técnicas: instancia sobre el stack canónico (Workers + D1 + R2), no un stack nuevo.
- Restricciones operativas identificadas (techo de cambios, onboarding B 2–4 h / A 6–10 h).
- Restricciones de seguridad identificadas (formularios, PII, auth solo si A).

---

## Metadatos y trazabilidad

- Frontmatter YAML en `01-problem.md` y `02-features.md` (`id`, `status`, `owner`, fechas, `sku`).
- RTM inicial en `01-problem.md` con IDs `ERR-XX` mapeados a `FEAT-XX`.
- RTM en `02-features.md` con cobertura 1:1 hacia módulos destino.
- Criterios de éxito en formato BDD (Dado / Cuando / Entonces).
- Out-of-scope explícito documentado.

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
