# Bóveda de diseños (bodega)

Catálogo de **experimentos visuales reutilizables** y del **mapa de skills** que los produjeron.

No es código de producto ni el Design System oficial (`design-system/`). Es conocimiento WIKA: qué se probó, con qué skills, qué tokens y capturas, para reutilizar o descartar en futuros proyectos.

```text
bodega-disenos/
├── README.md                 ← este índice
├── catalogo-skills.md        ← skills ocupadas (fuente + rol)
└── proyectos/
    └── trabajamos-com/       ← primer lote (Fase 2 web)
        ├── look-linkedin/    ← Look A
        ├── look-elegante/    ← Look B
        ├── look-colorido/    ← Look C (dirección elegida)
        ├── look-c-tipo/      ← C1 / C2 archivados · C3 Jakarta candado
        └── look-c-colores/   ← Coral, Lima y Cobalto archivados
```

## Cómo usar

1. Leer [`catalogo-skills.md`](catalogo-skills.md) para saber qué skill aplicar.
2. Abrir el look en `proyectos/{proyecto}/look-*/` (notas + capturas).
3. Si el Arquitecto firma un look, promover tokens/patrones a `design-system/` o a la iteración del proyecto en `proyectos/` — **no** copiar la bóveda como CSS de producción a ciegas.

## Estado

| Proyecto | Looks catalogados | Dirección |
| :--- | :--- | :--- |
| [trabajamos.com](proyectos/trabajamos-com/README.md) | A LinkedIn · B Elegante · C Colorido + forks tipo C1/C2/C3 + color Coral/Lima/Cobalto (+ historial 1–4b) | Look **C** elegido. Candado tipográfico **C3 Jakarta**. Coral, Lima y Cobalto archivados. Firma visual del Arquitecto pendiente |

## Relación con otros repos

| Repo | Rol |
| :--- | :--- |
| `wika-fundaments` (aquí) | Bóveda / catálogo / gobierno |
| `web-design` | Skills taste (`external/taste-skill/`) + MOD-DIR |
| `proyectos/web/{proyecto}` | Código SSR y pruebas Fase 2 |
| `design-system` | Tokens/componentes oficiales tras Gate visual |
