# Tipografía sobre Look C

Tres forks **solo de tipo** sobre [Look C Colorido](../look-colorido/README.md) (sunflower `#f5c400` + navy `#0c1b33`). Paleta, layout de concepto, ids de producto y contrato Contactar no se tocaron.

Skills: las mismas de Look C. Ningún fork introduce una skill nueva. El cambio es el eje tipográfico (ajuste de `redesign-existing-projects` / `redesign-skill` sobre el sistema ya fijado por `design-taste-frontend`).

| Fork | Carpeta | Rama (`proyectos`) | Receta | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **C1 Syne denso** | [c1-syne/](c1-syne/README.md) | `cursor/look-c-tipo-syne-aa58` @ `8542b742` | Syne display denso (tracking −0.055/−0.06) + Jakarta cuerpo 15.5/13 | Alternativa archivada |
| **C2 Editorial** | [c2-editorial/](c2-editorial/README.md) | `cursor/look-c-tipo-editorial-aa58` @ `e9a803dc` | Syne marca + Newsreader títulos/lead + Jakarta cuerpo | Alternativa archivada |
| **C3 Jakarta** | [c3-jakarta/](c3-jakarta/README.md) | `cursor/look-c-tipo-jakarta-aa58` @ `0d3578ce` | Syne solo logo; Plus Jakarta Sans en UI (14/16/20/28) | **Candado tipográfico** |

## Decisión

**C3 Jakarta es el candado de tipo** sobre la dirección Look C. C1 y C2 quedan archivados para comparar, no como base de los siguientes experimentos (color y banner).

Tests en los tres: `npm test` 64/64 en `proyectos/web/trabajamos-com/iterations/v1`.

## Encaje (una frase)

- **C1:** Syne más compacta (clamps más bajos + tracking cerrado) para que campos, CTAs, cards y el nombre de perfil quepan en 390 y 1280.
- **C2:** Aire editorial en el hero (marca Syne grande + Newsreader subordinado) y títulos/meta más densos en resultados.
- **C3:** Escala de producto predecible (Jakarta en títulos y UI, Syne solo en la marca) con la franja de búsqueda alineada y el hero móvil más corto.
