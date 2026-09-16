---
id: "WEB-MOD-RD-001"
title: "Ramon David — Módulos SKU A"
status: "EN_REVISION"
version: "0.2.0"
owner: "Vissiuss / Equipo WIKA"
created_at: "2026-09-16"
updated_at: "2026-09-16"
audit_1_passed: false
audit_2_passed: false
sku: "A"
---

# [03] Descubrimiento y Especificación de Módulos (Web)

> **Pre-requisito:** `audit_1_passed: true` en 01 y 02.  
> **SKU:** `A`. `mod-admin` **sí** aplica.

## 1. Identificación y Documentos Base

- **Nombre del Proyecto:** Ramon David — Acolchados CD
- **Especificaciones base:** `01-problem.md` (`WEB-PROB-RD-001`) | `02-features.md` (`WEB-FEAT-RD-001`)
- **sku:** `A`
- **Estado de gatekeeping:** `PENDIENTE_AUDITORIA_MODULOS`

---

## 2. Matriz de Trazabilidad Modular (RTM 1:1)

| ID Módulo | ID Feature | ID Problema | Nombre | Tipo | Responsabilidad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MOD-01` | `FEAT-01` | `ERR-01` | `mod-inicio` | sección | Hero, intro, beneficios |
| `MOD-02` | `FEAT-02` | `ERR-02` | `mod-lineas` | sección | Servicios ×5 |
| `MOD-03` | `FEAT-03` | `ERR-03` | `mod-equipo` | sección | Nosotros / valores |
| `MOD-04` | `FEAT-04` | `ERR-04` | `mod-contacto` | formulario | Form, tel, WhatsApp |
| `MOD-05` | `FEAT-05` | `ERR-05` | `mod-galeria` | sección | Grilla de fotos |
| `MOD-06` | `FEAT-06` | `ERR-06` | `mod-admin` | cms | Panel schema fijo |
| `MOD-DIR` | — | — | `mod-direction` | dirección | taste-skill |

---

## 3. Desglose de Arquitectura Modular

### Módulo `MOD-01`: `mod-inicio`

**Ruta prevista:** `iterations/v3/index.html`

- **Entradas:** hero slides, copy, CTA
- **Salidas:** click a líneas / contacto
- **Dependencias:** tokens de marca
- **Reutilizable:** No (tenant)

### Módulo `MOD-02`: `mod-lineas`

**Ruta prevista:** `iterations/v3/lineas.html` + bloque en home

- **Entradas:** 5 registros (nombre, texto, foto, CTA)
- **Salidas:** deep-link a contacto con interés
- **Dependencias:** ninguna
- **Reutilizable:** schema A reutilizable entre tenants

### Módulo `MOD-03`: `mod-equipo`

**Ruta prevista:** `iterations/v3/nosotros.html`

### Módulo `MOD-04`: `mod-contacto`

**Ruta prevista:** `iterations/v3/contacto.html`

- **Entradas:** nombre, email, interés, mensaje
- **Salidas:** estado success/error; `wa.me/56999194045`
- **Dependencias:** ninguna en v3; mail de plataforma después

### Módulo `MOD-05`: `mod-galeria`

**Ruta prevista:** `iterations/v3/galeria.html`

### Módulo `MOD-06`: `mod-admin`

**Ruta prevista:** `iterations/v3/admin/`

- **Entradas:** campos fijos del schema
- **Salidas:** `content.json` / localStorage overlay
- **Dependencias:** MOD-01…05 leen el mismo content
- **Prohibido:** CRUD de catálogo, MeLi, pagos

---

## 4. Resolución de dirección visual (taste-skill) — MOD-DIR

Resolver `direction_skill` usando `standards/direction-matrix.yaml`.

```yaml
mod_id: MOD-DIR
industry_type: luxury_dtc
business_model: dtc_textiles_medida
direction_skill: high-end-visual-design
direction_rationale: "Textiles premium para el hogar; mapping luxury_dtc → high-end-visual-design. Tokens V1 (Playfair, teal #148d94, paper) se elevan a v3, no se cambia de familia."
direction_locked: true
allowed_phase2_skills:
  - design-taste-frontend
  - redesign-existing-projects
forbidden_phase2_skills:
  - image-to-code
```

`direction_locked: true` al aprobar Gate 2. Cambiar de dirección exige reabrir la auditoría de módulos.
