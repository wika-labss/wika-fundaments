---
id: "WEB-PROB-RD-001"
title: "Ramon David — Acolchados CD (SKU A)"
status: "EN_REVISION"
version: "0.2.0"
owner: "Vissiuss / Equipo WIKA"
created_at: "2026-09-16"
updated_at: "2026-09-16"
audit_1_passed: false
sku: "A"
sku_rationale: "Alguien entra de verdad a un panel a cambiar textos, líneas y fotos. No es landing B. Catálogo infinito, Mercado Libre y pagos quedan fuera (forbidden_v1)."
industry_type: "luxury_dtc"
target_audience: "Hogares e interiorismo en Chile que buscan textiles de cama a medida"
brand_tone: "Elegante, cercano, oficio chileno"
---

# [01] Definición del Problema, Alcance y Metas (Web)

> **Equivalencia de auditoría:** `audit_1_passed: true` requiere aprobación formal en `docs/auditoria-documentacion.md`.  
> **Ruta del sitio:** `proyectos/web/ramon-david/`.  
> **SKU:** `A` según `standards/sku-contract.yaml`. Debe coincidir con `02-features.md`.

## 1. Identificación y Control de Cambios

- **Nombre del Proyecto:** Ramon David — Acolchados CD
- **Repositorio de aplicación:** `proyectos/web/ramon-david/`
- **Stakeholders clave:** Vissiuss (producto), Acolchados CD (cliente / contenido), visitante, operador del panel
- **Estado de gatekeeping:** `PENDIENTE_AUDITORIA_DOCUMENTACION`
- **industry_type (MOD-DIR):** `luxury_dtc`
- **sku:** `A` — tenant sobre la plataforma, no un stack Flask/Supabase nuevo
- **Referencia visual V1:** `wika-labss/proyectos` `app/ramon-david/iterations/v1/`
- **Salida esperada:** `iterations/v3/`

---

## 2. Clasificación A / B (plan de negocio)

Contrato: `standards/sku-contract.yaml`. Tesis: `docs/plan-de-negocio-web/plan-de-negocio.md`.

| Pregunta | B (landing) | A (sitio editable) | No-go |
|----------|-------------|--------------------|-------|
| ¿Alguien entra a un panel a editar? | No | **Sí** (operador CD) | Admin “por si acaso” |
| ¿El contenido cambia seguido? | No | **Sí** (líneas, fotos, copy) | — |
| ¿Pide reservas, pagos o login de visitantes? | — | — | **MeLi / carrito = no-go v1** |

- [x] SKU elegido: `A`
- [x] `sku_rationale` no vacío
- [x] Si **B**: N/A
- [x] Híbrido (“landing con un panel chico”): rechazado — es A de schema fijo
- [x] Catálogo 19 SKU + Mercado Libre del legado: **fuera de alcance**, no SKU C

---

## 3. Definición del Problema y Justificación

- **¿Qué problema se intenta resolver?**  
  Acolchados CD necesita una URL de marca (hero, líneas, historia, contacto, WhatsApp) que el operador pueda actualizar sin un repo Flask ni un catálogo-e-commerce.

- **Impacto actual / costo de oportunidad:**  
  El V1 en `proyectos/app/` mezcla vitrina, CRUD de 19 productos, uploads y Mercado Libre. Eso viola `forbidden_v1` (pagos, catálogo grande) y no es un tenant de la plataforma.

- **Análisis de brecha:**
  - **Estado actual:** Sitio Flask + JSON + admin + MeLi en `app/ramon-david/iterations/v1/`
  - **Estado deseado:** Tenant SKU A en `proyectos/web/ramon-david/iterations/v3/` (schema fijo, Workers/D1/R2 como destino de plataforma)

---

## 4. Matriz de Trazabilidad de Requerimientos (RTM Inicial)

| ID Problema | Descripción del Dolor | Impacto | ID Feature (`02-features.md`) | Módulo Destino (`03-module-discovery.md`) |
| :--- | :--- | :--- | :--- | :--- |
| `ERR-01` | No hay URL de marca alineada al SKU A | `Alto` | `FEAT-01` | `mod-inicio` |
| `ERR-02` | Las líneas de producto no caben en un hero único | `Alto` | `FEAT-02` | `mod-lineas` |
| `ERR-03` | Historia / equipo no se edita sin tocar HTML | `Medio` | `FEAT-03` | `mod-equipo` |
| `ERR-04` | Contacto solo por DM / teléfono suelto | `Alto` | `FEAT-04` | `mod-contacto` |
| `ERR-05` | Fotos de taller/piezas no tienen galería | `Medio` | `FEAT-05` | `mod-galeria` |
| `ERR-06` | Cambiar copy exige deploy o JSON a mano | `Alto` | `FEAT-06` | `mod-admin` |

---

## 5. Audiencia y Casos de Uso Core

- **Usuarios principales:**
  - **Rol 1:** Visitante / hogar o interiorista → **Necesidad:** ver marca, 5 líneas, pedir cotización por form o WhatsApp
  - **Rol 2:** Operador Acolchados CD → **Necesidad:** editar campos fijos en `/admin`
  - **Rol 3:** Operador WIKA → **Necesidad:** onboarding del tenant, no un repo nuevo

- **Fuera de alcance (Out of Scope explícito):**
  - Catálogo de 19+ SKU con tablas de precio por talla (`forbidden`: `catalogo_grande`)
  - Mercado Libre, carrito, pagos (`forbidden_v1`: `pagos`)
  - Login de visitantes
  - Flask, Vercel, WordPress, repo-por-cliente, VPS
  - Reservas

---

## 6. Objetivo y Beneficios Esperados

- **Objetivo:** Publicar v3 como tenant A: Inicio + 5 líneas + Equipo + Contacto + galería + `/admin` de campos fijos.
- **Beneficios esperados:**
  - Una URL de marca sin e-commerce
  - Operador edita sin tocar código
  - Legado Flask/MeLi queda archivado, no se reimplementa

---

## 7. Criterios de Éxito en Formato BDD (Gherkin)

### Escenario 1: Visitante recorre la vitrina

- **Dado que** `abre iterations/v3/index.html`
- **Cuando** `navega Inicio, Líneas, Nosotros, Galería y Contacto`
- **Entonces** `ve marca CD, 5 líneas, WhatsApp y formulario sin errores bloqueantes`

### Escenario 2: Operador usa el panel

- **Dado que** `sku es A`
- **Cuando** `abre /admin/`
- **Entonces** `edita campos fijos (hero, 5 líneas, equipo, contacto, galería) y no un CRUD infinito`

### Escenario 3: No-go de pagos

- **Dado que** `el visitante busca comprar en línea`
- **Cuando** `recorre v3`
- **Entonces** `no hay carrito ni Mercado Libre; el CTA es WhatsApp o form`

---

## 8. Restricciones

- **Técnicas:** SKU A; un código plataforma — Workers + D1 + R2. v3 es HTML de instancia (Fase 1+2 visual) hasta que el tenant viva en el Worker.
- **Operativas:** Onboarding A 6–10 h; techo de cambios del contrato 6 meses; 1 A = 3 B.
- **Seguridad:** Formulario PII; magic link de plataforma **solo A**; sin secretos en el repo. El `/admin` de v3 es demo de schema (localStorage) hasta magic link de plataforma.
