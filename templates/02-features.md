---
id: "WEB-FEAT-001"
title: "[Features y Secciones Web]"
status: "BORRADOR"
version: "0.1.0"
owner: "[Responsable]"
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
audit_1_passed: false
sku: ""
sku_rationale: ""
---

# [02] Features, Secciones y CTAs (Web)

> **Gate 1:** este documento se aprueba **junto con** `01-problem.md`.  
> **Equivalencia:** Auditoría de Documentación → `docs/auditoria-documentacion.md`.  
> El Gate 2 (Auditoría de Módulos) **no** se registra aquí; vive en `03-module-discovery.md`.  
> **`sku` debe ser idéntico al de `01-problem.md` (`A` o `B`).** Si `sku: B`, ninguna feature puede pedir `/admin`, CMS ni magic link.

## 1. Identificación y Control de Cambios

- **Nombre del Proyecto:** `[Ej. Landing oficios — WIKA]`
- **Documento base:** `idea/01-problem.md` (ID: `WEB-PROB-001`)
- **sku:** `[A | B]` — copiar de 01; no usar `portfolio` ni `site_type` libre
- **Estado de gatekeeping:** `[PENDIENTE_AUDITORIA_DOCUMENTACION]`

---

## 2. Alineación al SKU

- [ ] `sku` = valor de `01-problem.md`
- [ ] Features obligatorias caben en `allowed` de `standards/sku-contract.yaml`
- [ ] Nada de `forbidden_v1` (reservas, pagos, login de visitantes, WordPress, Vercel)
- [ ] Si **B**: sin panel, sin CMS, sin `FEAT` de admin. Regla de oro citada en `sku_rationale`
- [ ] Si **A**: panel de **campos fijos** (Inicio, Servicios ×5, Equipo, Contacto, galería). No admin custom infinito

---

## 3. Matriz de Trazabilidad de Requerimientos (RTM 1:1)

| ID Feature | ID Problema (`01-problem.md`) | Nombre | Prioridad | Módulo Destino (`03`) | SKU |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `FEAT-01` | `ERR-01` | `[Hero + CTA WhatsApp]` | `Crítica` | `mod-[nombre]` | `A\|B` |
| `FEAT-02` | `ERR-02` | `[Formulario de contacto]` | `Alta` | `mod-[nombre]` | `A\|B` |
| `FEAT-03` | `ERR-…` | `[Panel /admin]` | `Crítica` | `mod-admin` | **solo A** |

---

## 4. Funcionalidades Obligatorias

### Feature `FEAT-01`: [Nombre]

**Descripción:** `[Qué hace y valor para el visitante]`

#### Escenario 1.1: Flujo exitoso

- **Dado que** `[condición inicial]`
- **Cuando** `[acción del visitante]`
- **Entonces** `[resultado observable]`

#### Escenario 1.2: Manejo de errores

- **Dado que** `[condición de fallo]`
- **Cuando** `[se intenta la acción]`
- **Entonces** `[comportamiento seguro; mensaje o estado fallback]`

---

## 5. Funcionalidades Deseables (v1.1+)

| ID Feature | Nombre | Prioridad | Notas |
| :--- | :--- | :--- | :--- |
| `FEAT-03` | `[Nombre]` | `Media` | `[Fuera de v1 si no cabe en el SKU]` |

---

## 6. Fuera de Alcance

- `[Reservas, pagos, login de visitantes — forbidden_v1]`
- `[Híbrido B+panel: cotizar A o B, no mezclar]`

---

## 7. NFRs

- **Performance:** `[LCP razonable en 4G]`
- **SEO mínimo:** `[title, OG, sitemap si aplica]`
- **Accesibilidad:** `[landmarks, labels en forms]`
- **Plataforma:** `[tenant en Workers + D1 + R2; no repo por cliente]`
