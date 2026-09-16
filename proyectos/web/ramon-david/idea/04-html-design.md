---
id: "WEB-HTML-RD-001"
title: "Ramon David — HTML y look v3"
status: "EN_REVISION"
version: "0.2.0"
owner: "Vissiuss / Equipo WIKA"
created_at: "2026-09-16"
updated_at: "2026-09-16"
visual_approval_passed: false
audit_3_passed: false
construction_phase_complete: false
direction_skill: "high-end-visual-design"
sku: "A"
---

# [04] HTML Estructural, Wireframes y Aprobación Visual

> **Pre-requisito:** `audit_2_passed: true` en `03-module-discovery.md`.  
> `ready_for_construction` vive en `05-build-plan.md`.  
> **Salida esperada v3:** `iterations/v3/` (Fase 1 semántica + Fase 2 look high-end sobre tokens V1).

## 1. Identificación y Antecedentes

- **Nombre del Proyecto:** Ramon David — Acolchados CD
- **Documentos base:** 01 | 02 | 03 | 05
- **sku:** `A`
- **Estado de gatekeeping:** `PENDIENTE_APROBACION_VISUAL`
- **Referencia V1:** home/nosotros/contacto Flask (hero slider, teal, Playfair)

`direction_skill` = `high-end-visual-design` (MOD-DIR).

---

## 2. Mapa de vistas (VIEW-XX)

| ID Vista | Ruta / ancla | Módulos | Feature | SKU |
| :--- | :--- | :--- | :--- | :--- |
| `VIEW-01` | `/` `#hero` | `MOD-01` | `FEAT-01` | A |
| `VIEW-02` | `/lineas.html` | `MOD-02` | `FEAT-02` | A |
| `VIEW-03` | `/nosotros.html` | `MOD-03` | `FEAT-03` | A |
| `VIEW-04` | `/galeria.html` | `MOD-05` | `FEAT-05` | A |
| `VIEW-05` | `/contacto.html` | `MOD-04` | `FEAT-04` | A |
| `VIEW-06` | `/admin/` | `mod-admin` | `FEAT-06` | **solo A** |

Nav pública: Inicio, Líneas, Nosotros, Galería, Hablemos. **No** enlace «Precios» a un CRUD de 19 SKU.

---

## 3. Flujo principal

```text
[Hero] → [5 líneas] → [Nosotros / galería] → [Form o WhatsApp]
Operador: [/admin] → edita schema fijo → recarga vitrina
```

Estados del form: default, success, error (validación nativa + `aria-live`).

---

## 4. HTML semántico (Fase 1) + look v3 (Fase 2)

Landmarks: `header.site-header`, `nav#main-menu`, `main`, `footer.site-footer`. Headings h1 por página. Labels en el form. Botón menú con `aria-expanded`.

Tokens (heredados V1, pulidos v3):

| Token | Valor |
|-------|--------|
| `--ink` | `#171817` |
| `--paper` | `#f4f3ef` |
| `--cream` | `#e9e5dc` |
| `--teal` | `#148d94` |
| `--serif` | Playfair Display |
| `--sans` | DM Sans |

- [ ] `ready_for_construction` se activa en **05**, tras Gate 3A + 3B
- [ ] `construction_phase_complete` cuando `iterations/v3/` cumple este mapa **y** el SKU (B no aplica)
- [x] Fase 2: look high-end pedido como **salida esperada v3** (redesign del V1, no image-to-code)

---

## 5. Aprobación

- **Gate 3A** `visual_approval_passed` — wireframe / estructura.
- **Gate 3B** `audit_3_passed` — ensamblado 03+04+05.
- **Fase 1** `ready_for_construction` — flag en `05-build-plan.md`.
