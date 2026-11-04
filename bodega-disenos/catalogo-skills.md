# Catálogo de skills de diseño (bóveda)

Registro de **skills ocupadas** en experimentos visuales WIKA.  
Rutas relativas al monorepo de trabajo del agente (siblings de `wika-fundaments`).

> Inspired-by skills **no** autorizan clonar marcas ni assets de terceros.

---

## Skills de producto (trabajamos.com)

| Skill (carpeta) | Ruta | Rol | Usada en |
| :--- | :--- | :--- | :--- |
| `indeed-cl-inspired` | `proyectos/web/trabajamos-com/skills/indeed-cl-inspired/SKILL.md` | Anatomía search-first (qué/dónde, chips, cards densas). **No** marca Indeed en UI. | Look A (flujo home); Look C y forks tipo C1–C3 (solo orden de contenido); prueba 4 / 4b |
| `linkedin-profile-inspired` | `proyectos/web/trabajamos-com/skills/linkedin-profile-inspired/SKILL.md` | Anatomía perfil profesional (hero, Contactar, secciones). **No** marca LinkedIn en UI. | Look A (primaria); Look C y forks tipo C1–C3 (orden de secciones); prueba 4 / 4b |

---

## Skills taste / dirección (`web-design`)

| Skill (install name) | Carpeta | Rol | Usada en |
| :--- | :--- | :--- | :--- |
| `high-end-visual-design` | `web-design/external/taste-skill/skills/soft-skill/` | Agencia / Soft Structuralism: aire, tipografía fuerte, un acento, motion suave | Look B (principios; expresión **Pearl**, no prueba 3); prueba 3 (rechazada) |
| `design-taste-frontend` | `web-design/external/taste-skill/skills/taste-skill/` | Dials VARIANCE / MOTION / DENSITY + anti-slop | Look B (dials bajos); Look C (dials altos); forks tipo C1–C3 (mismos dials, solo tipo); Coral / Lima / Cobalto (eje color sobre C3) |
| `redesign-existing-projects` | `web-design/external/taste-skill/skills/redesign-skill/` | Audit tipografía/color/espacio sobre UI existente | Looks A/B/C; forks tipo C1–C3 (eje tipo); Coral / Lima / Cobalto (contraste sobre C3); polish orgánico 4b |
| `minimalist-ui` | `web-design/external/taste-skill/skills/minimalist-skill/` | Editorial warm monochrome | Prueba 1 (**rechazada**) |
| `industrial-brutalist-ui` | `web-design/external/taste-skill/skills/brutalist-skill/` | Swiss print / industrial | Prueba 2 (**rechazada**) |

---

## Mapa look → skills (lote paralelo 2026-11-03)

### Look A — LinkedIn / perfil profesional

| Prioridad | Skill | Cómo se aplicó |
| :--- | :--- | :--- |
| 1 | `linkedin-profile-inspired` | `ep-topcard`, Contactar en hero, TOC, bloques de sección |
| 2 | `indeed-cl-inspired` | Home qué/dónde + cards densas |
| 3 | `redesign-existing-projects` | Un acento teal, sin glass/píldoras AI |

**Rama código:** `proyectos` → `cursor/look-linkedin-aa58`  
**Ficha bóveda:** [proyectos/trabajamos-com/look-linkedin/](proyectos/trabajamos-com/look-linkedin/README.md)

### Look B — Elegante / premium

| Prioridad | Skill | Cómo se aplicó |
| :--- | :--- | :--- |
| 1 | `high-end-visual-design` | Soft Structuralism **Pearl** (papel frío + pizarra oceánica) |
| 2 | `design-taste-frontend` | Dials ~5–6 / 4–5 / 3 |
| 3 | `redesign-existing-projects` | Checklist anti-slop; sin isla glass de prueba 3 |

**Rama código:** `cursor/look-elegante-aa58`  
**Ficha:** [proyectos/trabajamos-com/look-elegante/](proyectos/trabajamos-com/look-elegante/README.md)

### Look C — Moderno colorido

| Prioridad | Skill | Cómo se aplicó |
| :--- | :--- | :--- |
| 1 | `design-taste-frontend` | Dials ~8–9 / 7–8 / 4–5; sistema sunflower + navy |
| 2 | `redesign-existing-projects` | Jerarquía/CTA/anti-defaults |
| 3 | `indeed-cl-inspired` + `linkedin-profile-inspired` | Solo **IA de contenido** (qué va dónde), no su piel corporativa |

**Rama código:** `cursor/look-colorido-aa58`  
**Ficha:** [proyectos/trabajamos-com/look-colorido/](proyectos/trabajamos-com/look-colorido/README.md)

### Tipografía sobre Look C

Forks **solo de tipo** de Look C. Paleta sunflower `#f5c400` + navy `#0c1b33`, layout de concepto, ids y Contactar intactos. No entra skill nueva: se reutilizan `design-taste-frontend`, `redesign-existing-projects` (`redesign-skill`) y la IA de Indeed/LinkedIn (orden de contenido, no piel).

| Fork | Rama @ SHA | Qué cambió | Estado |
| :--- | :--- | :--- | :--- |
| **C1 Syne denso** | `cursor/look-c-tipo-syne-aa58` @ `8542b742` | Syne display con tracking −0.055/−0.06 y clamps más bajos; Jakarta cuerpo 15.5px / meta 13px | Alternativa archivada |
| **C2 Editorial Newsreader** | `cursor/look-c-tipo-editorial-aa58` @ `e9a803dc` | Syne solo en la marca; Newsreader en títulos y lead; Jakarta en cuerpo y meta | Alternativa archivada |
| **C3 Jakarta** | `cursor/look-c-tipo-jakarta-aa58` @ `0d3578ce` | Syne solo en el logo; Plus Jakarta Sans en títulos y UI (escala 14/16/20/28) | **Candado tipográfico** |

**C3 es el candado.** C1 y C2 quedan archivados. Índice: [proyectos/trabajamos-com/look-c-tipo/](proyectos/trabajamos-com/look-c-tipo/README.md).

### Color y banner sobre C3 (agentes en curso)

Mismo set en los tres. Base: candado **C3 Jakarta**. No hay skill nueva de tipo ni de IA. El cambio pedido es paleta (`design-taste-frontend`, eje color) + jerarquía (`redesign-existing-projects` / `redesign-skill`) y el banner **estático → móvil (CSS)**.

| Agente | Rama | Paleta | Skills |
| :--- | :--- | :--- | :--- |
| **Coral** | `cursor/look-c-color-coral-aa58` | coral `#e85d4c` + ink `#1c1412` | `design-taste-frontend` (color) + `redesign-skill`; banner CSS animado |
| **Lima** | `cursor/look-c-color-lima-aa58` | lime `#c6f135` + charcoal `#121417` | mismo set, otra paleta |
| **Cobalto** | `cursor/look-c-color-cobalto-aa58` | cobalt `#2f5bff` + apricot `#ffb085` | mismo set, otra paleta |

Capturas: **pendiente** (ramas aún en curso; sin NOTES ni png al registrar). Índice: [proyectos/trabajamos-com/look-c-colores/](proyectos/trabajamos-com/look-c-colores/README.md).

---

## Historial previo (misma app, no lote A/B/C)

| Prueba | Skills | Veredicto |
| :--- | :--- | :--- |
| 1 | `minimalist-ui` | No convence |
| 2 | `industrial-brutalist-ui` | No convence |
| 3 | `high-end-visual-design` (Soft Structuralism isla) | No convence |
| 4 | `indeed-cl-inspired` + `linkedin-profile-inspired` | Anatomía útil; look frío |
| 4b | + `redesign-existing-projects` (polish orgánico sage) | Pendiente / superado por lote A/B/C |

Detalle en `proyectos/web/trabajamos-com/idea/pruebas-fase2.md`.

---

## Reglas de bóveda

1. Toda skill citada debe existir en su repo fuente (no inventar nombres).
2. Looks inspired-by: sin logos/nombres de terceros en UI ni en capturas de producto.
3. Al firmar un look, actualizar esta tabla con `veredicto: firmado` y abrir handoff a `design-system` si aplica.
