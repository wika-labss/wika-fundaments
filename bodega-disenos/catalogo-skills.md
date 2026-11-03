# Catálogo de skills de diseño (bóveda)

Registro de **skills ocupadas** en experimentos visuales WIKA.  
Rutas relativas al monorepo de trabajo del agente (siblings de `wika-fundaments`).

> Inspired-by skills **no** autorizan clonar marcas ni assets de terceros.

---

## Skills de producto (trabajamos.com)

| Skill (carpeta) | Ruta | Rol | Usada en |
| :--- | :--- | :--- | :--- |
| `indeed-cl-inspired` | `proyectos/web/trabajamos-com/skills/indeed-cl-inspired/SKILL.md` | Anatomía search-first (qué/dónde, chips, cards densas). **No** marca Indeed en UI. | Look A (flujo home); Look C (solo orden de contenido); prueba 4 / 4b |
| `linkedin-profile-inspired` | `proyectos/web/trabajamos-com/skills/linkedin-profile-inspired/SKILL.md` | Anatomía perfil profesional (hero, Contactar, secciones). **No** marca LinkedIn en UI. | Look A (primaria); Look C (orden de secciones); prueba 4 / 4b |

---

## Skills taste / dirección (`web-design`)

| Skill (install name) | Carpeta | Rol | Usada en |
| :--- | :--- | :--- | :--- |
| `high-end-visual-design` | `web-design/external/taste-skill/skills/soft-skill/` | Agencia / Soft Structuralism: aire, tipografía fuerte, un acento, motion suave | Look B (principios; expresión **Pearl**, no prueba 3); prueba 3 (rechazada) |
| `design-taste-frontend` | `web-design/external/taste-skill/skills/taste-skill/` | Dials VARIANCE / MOTION / DENSITY + anti-slop | Look B (dials bajos); Look C (dials altos) |
| `redesign-existing-projects` | `web-design/external/taste-skill/skills/redesign-skill/` | Audit tipografía/color/espacio sobre UI existente | Looks A/B/C; polish orgánico 4b |
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
