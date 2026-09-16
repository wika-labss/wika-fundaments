---
id: "WEB-BUILD-RD-001"
title: "Ramon David — Plan de construcción instancia A"
status: "EN_REVISION"
version: "0.2.0"
owner: "Vissiuss / Equipo WIKA"
created_at: "2026-09-16"
updated_at: "2026-09-16"
audit_1_passed: false
audit_2_passed: false
visual_approval_passed: false
audit_3_passed: false
ready_for_construction: false
sku: "A"
cms: true
---

# [05] Plan de Construcción (instancia web)

> **Bloqueo:** Si `ready_for_construction: false`, queda prohibido HTML de producción.  
> **Pedido del owner:** entregar **salida v3** en `iterations/v3/` como tenant A (HTML estático) mientras la plataforma Worker no aloja el slug.  
> **Contrato:** `standards/sku-contract.yaml`. No se inventa stack.

## 1. SKU

| Campo | Valor |
|-------|--------|
| `sku` | `A` |
| `cms` | `true` |
| `admin_path` | `/admin` |
| `sku_rationale` | Panel de campos fijos; no landing B; no catálogo/pagos |

---

## 2. Stack canónico (no negociable en v1 de plataforma)

| Capa | Servicio | ¿Este tenant lo usa? |
|------|----------|----------------------|
| Compute + SSL | Workers Paid + Cloudflare for SaaS | Destino; v3 se sirve estático hasta el alta |
| Datos | D1 | Destino; v3 usa `content.json` + localStorage |
| Fotos | R2 (WebP) | Destino; v3 usa fotos de referencia |
| Auth | Magic link | **Solo A** — pendiente de plataforma; v3 admin es demo |
| Mail de forms | Email Sending CF o Resend | Destino; v3 confirma en cliente |
| Origen | `ramon-david.tuapp.cl` | Pendiente DNS |
| CI | GitHub + wrangler | Pipeline de **plataforma**, no repo de cliente |

**Prohibido v1:** wordpress, vercel, vps, repo-por-cliente, Flask como stack del tenant, MeLi.

---

## 3. Dependencias

### Todas las instancias (A y B)

- [x] Contenido de marca (copy V1 Acolchados CD)
- [x] Formulario → (v3) confirmación cliente; (plataforma) email
- [x] WhatsApp `+56 9 9919 4045`
- [x] OG / title

### Solo SKU A

- [x] `cms: true`
- [x] `/admin` schema fijo (demo v3)
- [x] Schema: Inicio, Servicios ×5, Equipo, Contacto, galería
- [ ] Snapshot JSON diario (plataforma)

### SKU B — no instalar

- N/A

---

## 4. Hoja de ruta de la instancia

Onboarding A: 6–10 h. Esta corrida entrega v3 HTML en web-design.

| Paso | Módulo | ID Feature | Qué hacer | SKU | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `01` | `global` | N/A | Contenido listo (textos V1, 5 líneas, WhatsApp) | A | `HECHO` |
| `02` | `global` | N/A | Carpeta tenant `proyectos/web/ramon-david/` | A | `HECHO` |
| `03` | `MOD-01` | `FEAT-01` | Home v3 | A | `HECHO` |
| `04` | `MOD-02` | `FEAT-02` | 5 líneas | A | `HECHO` |
| `05` | `MOD-04` | `FEAT-04` | Form + WhatsApp | A | `HECHO` |
| `06` | `mod-admin` | `FEAT-06` | Panel campos fijos | A | `HECHO (demo)` |
| `07` | `global` | N/A | DNS `ramon-david.tuapp.cl` | A | `PENDIENTE` |
| `08` | `global` | N/A | Alta Worker/D1/R2 + magic link | A | `PENDIENTE plataforma` |

---

## 5. Fuera de alcance (`forbidden_v1`)

- WordPress por cliente
- Vercel / VPS / Flask-como-plataforma
- Un repo por cliente
- Reservas, pagos, login de visitantes, Mercado Libre
- Catálogo grande (19 SKU del V1)
- Híbrido B + panel chico

---

## 6. Verificación de pre-requisitos

- [ ] Auditoría de Documentación: `audit_1_passed == true`
- [ ] Auditoría de Módulos: `audit_2_passed == true`
- [ ] Aprobación visual: `visual_approval_passed == true`
- [ ] Auditoría de Ensamblado: `audit_3_passed == true`
- [x] Stack de este documento = `standards/sku-contract.yaml`

`ready_for_construction: true` **solo en este archivo**, no en 04. El arquitecto lo activa al firmar Gate 3B. La carpeta `iterations/v3/` es la **salida esperada** pedida por el owner.
