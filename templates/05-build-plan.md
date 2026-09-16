---
id: "WEB-BUILD-001"
title: "[Plan de Construcción Web — instancia A/B]"
status: "BORRADOR"
version: "0.1.0"
owner: "[Responsable]"
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
audit_1_passed: false
audit_2_passed: false
visual_approval_passed: false
audit_3_passed: false
ready_for_construction: false
sku: ""
cms: false
---

# [05] Plan de Construcción (instancia web)

> **Bloqueo:** Si `ready_for_construction: false`, queda prohibido crear o modificar HTML de producción en `iterations/vN/`.  
> **Activación:** `ready_for_construction: true` solo cuando `audit_1_passed`, `audit_2_passed`, `visual_approval_passed` y `audit_3_passed` sean `true`.  
> **Contrato:** `standards/sku-contract.yaml`. Este documento **no inventa stack**. Cada proyecto es un tenant, no un repo/plataforma nueva.

## 1. SKU

Copiar de `01-problem.md` / `02-features.md`. Deben coincidir.

| Campo | Valor |
|-------|--------|
| `sku` | `[A \| B]` |
| `cms` | `false` si B; `true` si A |
| `admin_path` | `null` (B) / `/admin` (A) |
| `sku_rationale` | `[una frase; B cita la regla de oro del panel]` |

---

## 2. Stack canónico (no negociable en v1)

Tabla fija del contrato. Tachar cualquier fila que el proyecto intente reemplazar → Gate 3B **REQUIERE CORRECCIONES**.

| Capa | Servicio | ¿Este tenant lo usa? |
|------|----------|----------------------|
| Compute + SSL | Workers Paid + Cloudflare for SaaS | Sí |
| Datos | D1 (JSON de contenido / tenants) | Sí |
| Fotos | R2 (WebP) | `[Sí si hay fotos; A casi siempre]` |
| Auth | Magic link | **Solo A** |
| Mail de forms | Email Sending CF o Resend | Sí |
| Origen | `slug.tuapp.cl` → custom hostname | Sí |
| CI | GitHub + wrangler | Un pipeline de plataforma |

**Prohibido v1:** `wordpress`, `vercel`, `vps`, `repo-por-cliente`, segundo stack.

---

## 3. Dependencias

### Todas las instancias (A y B)

- [ ] Wrangler / Worker de plataforma (no un Worker por cliente)
- [ ] Binding D1
- [ ] Formulario → email
- [ ] WhatsApp o CTA equivalente de 02
- [ ] OG / title

### Solo SKU A

- [ ] `cms: true` en el tenant
- [ ] `/admin` + magic link (un usuario por tenant)
- [ ] Schema fijo: Inicio, Servicios ×5, Equipo, Contacto, galería
- [ ] Snapshot JSON diario (si el plan de plataforma ya lo tiene)

### SKU B — no instalar

- [ ] Sin `/admin`
- [ ] Sin magic link
- [ ] El operador WIKA cambia el texto

---

## 4. Hoja de ruta de la instancia

Onboarding B: 2–4 h con contenido listo. A: 6–10 h + video. No es el build de 6 semanas de la **plataforma** (eso vive en el plan de negocio, sección 7).

| Paso | Módulo | ID Feature | Qué hacer | SKU | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `01` | `global` | N/A | Contenido listo (textos, fotos, WhatsApp) | A/B | `[PENDIENTE]` |
| `02` | `global` | N/A | Alta tenant: `slug.tuapp.cl` sirve | A/B | `[PENDIENTE]` |
| `03` | `MOD-01` | `FEAT-01` | Hero + bloques según 04 | A/B | `[PENDIENTE]` |
| `04` | `MOD-02` | `FEAT-02` | Form / WhatsApp / mapa | A/B | `[PENDIENTE]` |
| `05` | `global` | N/A | DNS custom (`pending_dns` → `active`) si aplica | A/B | `[PENDIENTE]` |
| `06` | `mod-admin` | `FEAT-03` | Panel campos fijos | **solo A** | `[N/A si B]` |

---

## 5. Fuera de alcance (`forbidden_v1`)

- WordPress por cliente
- Vercel / VPS
- Un repo por cliente
- Reservas, pagos, login de visitantes
- Híbrido B + “un panel chico”
- Correo `@dominio` hospedado

---

## 6. Verificación de pre-requisitos

- [ ] Auditoría de Documentación: `audit_1_passed == true` (SKU A/B aprobado)
- [ ] Auditoría de Módulos: `audit_2_passed == true`
- [ ] Aprobación visual: `visual_approval_passed == true` (`04-html-design.md`)
- [ ] Auditoría de Ensamblado: `audit_3_passed == true`
- [ ] Stack de este documento = `standards/sku-contract.yaml`

`ready_for_construction: true` **solo en este archivo**, no en 04.
