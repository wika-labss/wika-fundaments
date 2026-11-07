# Color y banner sobre C3 Jakarta

Tres agentes en paralelo, **encima del candado tipográfico C3** ([look-c-tipo/c3-jakarta/](../look-c-tipo/c3-jakarta/README.md), rama `cursor/look-c-tipo-jakarta-aa58` @ `0d3578ce`). No reabren el tipo ni la IA de Look C. El experimento es paleta + banner.

## Skills asignadas (las tres)

| Orden | Skill | Uso en este lote |
| :--- | :--- | :--- |
| 1 | **design-taste-frontend** (`taste-skill`) | Eje **color**: una paleta distinta por agente, sobre los dials altos de Look C |
| 2 | **redesign-existing-projects** (`redesign-skill`) | Jerarquía, contraste y CTA sobre la UI ya cerrada en C3 |

Base heredada, no reimplementada: tipo **Plus Jakarta Sans** (Syne solo logo) y orden de contenido Indeed/LinkedIn de Look C.

## Banner

El banner pasa de **estático → móvil (CSS)**. La animación es CSS (sin librería de motion ni video). El resto del layout de C3 se mantiene.

## Variantes

| Agente | Rama (`proyectos`) | Paleta | Ficha | Capturas |
| :--- | :--- | :--- | :--- | :--- |
| **Coral** | `cursor/look-c-color-coral-aa58` @ `47da9ba5` | coral `#e85d4c` + ink `#1c1412` + paper `#fff6f3` | [coral/](coral/README.md) | inicio, perfil, mobile |
| **Lima** | `cursor/look-c-color-lima-aa58` @ `9616a138` | electric lime `#c6f135` + charcoal `#121417` + mist `#f3f6ee` | [lima/](lima/README.md) | inicio, perfil, mobile |
| **Cobalto** | `cursor/look-c-color-cobalto-aa58` @ `a96a8164` | cobalt `#2f5bff` + apricot `#ffb085` + ink `#0e1320` + paper `#f4f6ff` | [cobalto/](cobalto/README.md) | inicio, perfil, mobile |

Coral, Lima y Cobalto están **archivados** (tests 64/64). Coral y Cobalto usan stripe drift (`translate3d` de un periodo, freeze en reduced-motion). Lima usa `lima-drift` (`translate3d` de un periodo de 64px, brillo mist y blob en el hero, freeze en reduced-motion). No copiar código de producto aquí.
