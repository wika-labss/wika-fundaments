# Auditoría de Release V1 (web)

## Objetivo

Validar que la iteración es publicable: Fase 1 (HTML semántico) completa, alineada al **SKU A o B del plan de negocio**, y, si aplica, Fase 2 (dirección visual) según MOD-DIR.

Ningún sitio podrá avanzar a `final/` sin aprobar esta auditoría.

---

# Entradas

## Obligatorias

- Documentación oficial en `proyectos/web/{proyecto}/idea/` (01–05) con gates de construcción en `true`.
- Código/HTML de `iterations/vN/` (o la iteración nominada).
- `construction_phase_complete: true` en `04-html-design.md`.
- `ready_for_construction: true` en `05-build-plan.md`.
- `standards/sku-contract.yaml` y tesis `docs/plan-de-negocio-web/plan-de-negocio.md`.
- Si se declara look final: `direction_locked: true` y skills de Fase 2 aplicadas.
- Auditorías previas en `audits/`.

---

# Validaciones

## SKU vs código (plan de negocio)

- `sku` de idea/ es `A` o `B` y coincide en 01–05.
- **B:** sin `/admin`, sin CMS, sin magic link, sin panel. El operador cambia texto.
- **A:** `/admin` de schema fijo (Inicio, Servicios ×5, Equipo, Contacto, galería). No WordPress. No admin “según lo que pida el cliente”.
- Un solo código de plataforma (tenant). No repo por cliente.
- Nada de `forbidden_v1`: wordpress, vercel, vps, reservas, pagos, login-visitantes, híbrido.
- `cms` del tenant coincide con el SKU (`false` B / `true` A).

---

## Construcción Fase 1

- HTML semántico (landmarks, headings, forms con labels).
- Sin look final mezclado si Fase 2 no está en alcance de esta iteración.
- CTAs y secciones de `02-features.md` presentes y permitidas por el SKU.

---

## Diseño Fase 2 (si aplica)

- Solo se usó `direction_skill` de MOD-DIR.
- No se invocaron skills en `forbidden_phase2_skills`.
- `design-taste-frontend` o `redesign-existing-projects` según contrato.

---

## Funcionalidad y BDD

- Features obligatorias de `02-features.md` operativas.
- Criterios de éxito BDD de `01-problem.md` cumplidos o desviaciones registradas.
- Formulario / WhatsApp / estados de error cubiertos si aplican.

---

## Seguridad

- Formularios sin filtrar PII a logs.
- Secretos fuera del repositorio (`.env` no commiteado).
- Enlaces externos `rel` documentado si hay `target=_blank`.
- Magic link **solo** si SKU A.

---

## Documentación

- Resultado de esta auditoría en `audits/auditoria-release-v1.md`.
- Cambios relevantes registrados.
- Desviaciones vs `sku-contract.yaml` registradas o ausentes.

---

# Activación

Al aprobar, el arquitecto debe:

1. Registrar resultado **APROBADO** en `audits/auditoria-release-v1.md` del proyecto.
2. Autorizar consolidación en `proyectos/web/{proyecto}/final/`.

No existe flag YAML de construcción para este gate: el registro en `audits/` es la fuente de verdad.

---

# Resultado

## APROBADO

La solución puede copiarse a `final/` y usarse para demo o publicación.

## REQUIERE CORRECCIONES

Debe construirse una nueva iteración.

## RECHAZADO

La solución no es apta para liberación (incluye violación de SKU / `forbidden_v1`).

---

# Regla

Ninguna versión puede avanzar a `final/` ni a publicación sin aprobar esta auditoría ni si el HTML viola el plan de negocio.
