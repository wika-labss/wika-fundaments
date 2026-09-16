---
id: "WEB-PROB-001"
title: "[Definición del Problema Web]"
status: "BORRADOR"
version: "0.1.0"
owner: "[Responsable]"
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
audit_1_passed: false
sku: ""
sku_rationale: ""
industry_type: ""
target_audience: ""
brand_tone: ""
---

# [01] Definición del Problema, Alcance y Metas (Web)

> **Equivalencia de auditoría:** `audit_1_passed: true` requiere aprobación formal en `docs/auditoria-documentacion.md`.  
> **Ruta del sitio:** `proyectos/web/{proyecto}/`.  
> **SKU:** solo `A` o `B` según `standards/sku-contract.yaml`. No existe un tercer modelo. `sku` de 01 y 02 deben coincidir.

## 1. Identificación y Control de Cambios

- **Nombre del Proyecto:** `[Ej. Landing oficios — WIKA]`
- **Repositorio de aplicación:** `proyectos/web/[nombre-proyecto]/`
- **Stakeholders clave:** `[Lista de involucrados y roles]`
- **Estado de gatekeeping:** `[PENDIENTE_AUDITORIA_DOCUMENTACION]`
- **industry_type (MOD-DIR):** `[b2b_saas | luxury_dtc | wellness | … ver standards/direction-matrix.yaml]`
- **sku:** `[A | B]` — instancia sobre la plataforma, no un stack nuevo

---

## 2. Clasificación A / B (plan de negocio)

Contrato: `standards/sku-contract.yaml`. Tesis: `docs/plan-de-negocio-web/plan-de-negocio.md`.

| Pregunta | B (landing) | A (sitio editable) | No-go |
|----------|-------------|--------------------|-------|
| ¿Alguien entra a un panel a editar? | No | Sí, de verdad | Admin “por si acaso” |
| ¿El contenido cambia seguido? | No (nosotros lo cambiamos) | Sí | — |
| ¿Pide reservas, pagos o login de visitantes? | — | — | **No se construye** |

- [ ] SKU elegido: `A` / `B`
- [ ] `sku_rationale` no vacío
- [ ] Si **B**: se cita la regla de oro — *esto no incluye panel. Si lo necesitas, es el plan sitio (A).*
- [ ] Si pide híbrido (“landing con un panel chico”): **rechazar** y cotizar A o B, no ambos
- [ ] Si no cabe en A ni B (p. ej. portfolio a medida, catálogo): **no-go**, no inventar SKU C

---

## 3. Definición del Problema y Justificación

- **¿Qué problema se intenta resolver?**  
  `[Dolor actual: sin URL, Instagram no convierte, etc.]`

- **Impacto actual / costo de oportunidad:**  
  `[Consecuencias de no resolver el problema.]`

- **Análisis de brecha:**
  - **Estado actual:** `[Sin sitio / Wix / Instagram]`
  - **Estado deseado:** `[Tenant B o A en la plataforma; no un repo nuevo]`

---

## 4. Matriz de Trazabilidad de Requerimientos (RTM Inicial)

| ID Problema | Descripción del Dolor | Impacto | ID Feature (`02-features.md`) | Módulo Destino (`03-module-discovery.md`) |
| :--- | :--- | :--- | :--- | :--- |
| `ERR-01` | `[Ej. No existe URL para Ads]` | `Alto` | `FEAT-01` | `mod-[nombre]` |
| `ERR-02` | `[Ej. Contacto solo por DM]` | `Alto` | `FEAT-02` | `mod-[nombre]` |

---

## 5. Audiencia y Casos de Uso Core

- **Usuarios principales:**
  - **Rol 1:** `[Cliente final]` → **Necesidad:** `[Encontrar WhatsApp / pedir hora]`
  - **Rol 2:** `[Operador WIKA]` → **Necesidad:** `[Publicar y mantener]`

- **Fuera de alcance (Out of Scope explícito):**
  - `[Reservas, pagos, login de visitantes en v1 — forbidden_v1]`

---

## 6. Objetivo y Beneficios Esperados

- **Objetivo:** `[Resultado medible al cerrar v1]`
- **Beneficios esperados:**
  - `[Beneficio 1]`

---

## 7. Criterios de Éxito en Formato BDD (Gherkin)

### Escenario 1: [Flujo principal]

- **Dado que** `[un visitante abre la URL]`
- **Cuando** `[completa el flujo principal de 02-features.md]`
- **Entonces** `[obtiene el resultado esperado sin errores bloqueantes]`

---

## 8. Restricciones

- **Técnicas:** `[SKU A/B; un solo código plataforma — Workers + D1 + R2]`
- **Operativas:** `[Techo de cambios, contrato 6 meses; onboarding B 2–4 h / A 6–10 h]`
- **Seguridad:** `[Formulario, PII, sin secretos en el repo; magic link solo si A]`
