---
id: "WEB-FEAT-RD-001"
title: "Ramon David — Features SKU A"
status: "EN_REVISION"
version: "0.2.0"
owner: "Vissiuss / Equipo WIKA"
created_at: "2026-09-16"
updated_at: "2026-09-16"
audit_1_passed: false
sku: "A"
sku_rationale: "Panel de campos fijos: Inicio, 5 líneas, Equipo, Contacto, galería. Sin catálogo infinito ni pagos."
---

# [02] Features, Secciones y CTAs (Web)

> **Gate 1:** este documento se aprueba **junto con** `01-problem.md`.  
> **Equivalencia:** Auditoría de Documentación → `docs/auditoria-documentacion.md`.  
> **`sku` debe ser idéntico al de `01-problem.md` (`A`).**

## 1. Identificación y Control de Cambios

- **Nombre del Proyecto:** Ramon David — Acolchados CD
- **Documento base:** `idea/01-problem.md` (ID: `WEB-PROB-RD-001`)
- **sku:** `A`
- **Estado de gatekeeping:** `PENDIENTE_AUDITORIA_DOCUMENTACION`

---

## 2. Alineación al SKU

- [x] `sku` = `A` (igual que 01)
- [x] Features caben en `allowed` de SKU A (`todo_B` + cms campos fijos + `/admin`)
- [x] Nada de `forbidden_v1` en obligatorias
- [x] Panel = schema fijo, no admin custom infinito
- [x] 5 líneas = Servicios ×5 del contrato (Colchas, Pieceras, Sábanas, Plumones, Hotelería/bordado)

---

## 3. Matriz de Trazabilidad de Requerimientos (RTM 1:1)

| ID Feature | ID Problema | Nombre | Prioridad | Módulo Destino | SKU |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `FEAT-01` | `ERR-01` | Hero + Inicio | `Crítica` | `mod-inicio` | A |
| `FEAT-02` | `ERR-02` | Cinco líneas de producto | `Crítica` | `mod-lineas` | A |
| `FEAT-03` | `ERR-03` | Equipo / Nosotros | `Alta` | `mod-equipo` | A |
| `FEAT-04` | `ERR-04` | Contacto + WhatsApp + form | `Crítica` | `mod-contacto` | A |
| `FEAT-05` | `ERR-05` | Galería | `Alta` | `mod-galeria` | A |
| `FEAT-06` | `ERR-06` | Panel `/admin` campos fijos | `Crítica` | `mod-admin` | **solo A** |

---

## 4. Funcionalidades Obligatorias

### Feature `FEAT-01`: Inicio (hero + marca)

**Descripción:** Home con slider, copy de marca, CTA a líneas y a contacto. Tokens visuales teal/ink/paper (V1) llevados a look v3.

#### Escenario 1.1: Flujo exitoso

- **Dado que** `el visitante abre /`
- **Cuando** `carga el hero`
- **Entonces** `ve marca Acolchados CD, CTA «Hablemos» y acceso a líneas`

#### Escenario 1.2: Manejo de errores

- **Dado que** `una imagen del hero no carga`
- **Cuando** `se renderiza la diapositiva`
- **Entonces** `queda el overlay y el texto; no se rompe el layout`

---

### Feature `FEAT-02`: Cinco líneas (Servicios ×5)

**Descripción:** Colchas, Pieceras, Sábanas, Plumones, Hotelería/bordado. No es el catálogo de 19 SKU.

#### Escenario 2.1: Flujo exitoso

- **Dado que** `abre líneas`
- **Cuando** `recorre las cinco tarjetas`
- **Entonces** `cada línea tiene nombre, texto y CTA a contacto/WhatsApp`

#### Escenario 2.2: Manejo de errores

- **Dado que** `falta una foto de línea`
- **Cuando** `pinta la tarjeta`
- **Entonces** `usa color de marca; no lista 19 productos`

---

### Feature `FEAT-03`: Equipo / Nosotros

**Descripción:** Historia de taller en San Miguel y valores (excelencia, responsabilidad, cercanía).

#### Escenario 3.1: Flujo exitoso

- **Dado que** `abre nosotros.html`
- **Cuando** `lee el bloque equipo`
- **Entonces** `ve dirección de taller y relato de oficio`

---

### Feature `FEAT-04`: Contacto, form y WhatsApp

**Descripción:** Formulario (nombre, email, interés, mensaje) + tel + mail + WhatsApp `+56 9 9919 4045`. Envío real = mail de plataforma (v3 confirma en cliente).

#### Escenario 4.1: Flujo exitoso

- **Dado que** `completa el form`
- **Cuando** `envía`
- **Entonces** `ve estado de éxito y puede abrir WhatsApp`

#### Escenario 4.2: Manejo de errores

- **Dado que** `email inválido o campos vacíos`
- **Cuando** `intenta enviar`
- **Entonces** `el browser/form muestra error; no finge envío`

---

### Feature `FEAT-05`: Galería

**Descripción:** Hasta una grilla de piezas/espacios (schema `galeria`). Sin SKU shoppable.

#### Escenario 5.1: Flujo exitoso

- **Dado que** `abre galeria.html`
- **Cuando** `ve la grilla`
- **Entonces** `hay fotos con alt y enlace de vuelta a líneas/contacto`

---

### Feature `FEAT-06`: Panel `/admin`

**Descripción:** Campos fijos del contrato. v3: demo local (content.json + localStorage). Destino de plataforma: magic link + D1.

#### Escenario 6.1: Flujo exitoso

- **Dado que** `el operador abre /admin/`
- **Cuando** `cambia el hero o una línea y guarda`
- **Entonces** `la vitrina pública refleja el cambio en esta sesión`

#### Escenario 6.2: Manejo de errores

- **Dado que** `intenta añadir una sexta línea o un SKU suelto`
- **Cuando** `usa el panel`
- **Entonces** `no hay CRUD infinito; solo los campos del schema`

---

## 5. Funcionalidades Deseables (v1.1+)

| ID Feature | Nombre | Prioridad | Notas |
| :--- | :--- | :--- | :--- |
| `FEAT-07` | Magic link real de plataforma | `Alta` | Sustituye demo localStorage |
| `FEAT-08` | Form → email (CF / Resend) | `Alta` | Hoy confirmación cliente |
| `FEAT-09` | Fotos en R2 WebP | `Media` | Hoy Unsplash de referencia V1 |

---

## 6. Fuera de Alcance

- Catálogo 19 productos / tablas de talla-precio
- Mercado Libre, carrito, pagos, stock
- Login de visitantes
- Flask, Supabase como CMS del tenant, WordPress, Vercel
- Híbrido B+panel

---

## 7. NFRs

- **Performance:** LCP razonable en 4G (hero con overlay, imágenes `w=1600`)
- **SEO mínimo:** title + description + OG por página
- **Accesibilidad:** landmarks, labels, `aria-expanded` del menú
- **Plataforma:** tenant Workers + D1 + R2; v3 es la instancia HTML hasta el Worker compartido
