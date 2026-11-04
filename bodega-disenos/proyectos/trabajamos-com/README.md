# Bóveda — trabajamos.com (web)

Portal de oficios cercanos (Chile). Fase 1 SSR firmada; **Fase 2 look sin firmar**.

Código vivo: `proyectos/web/trabajamos-com/iterations/v1/` (ramas por look abajo).  
Pruebas locales: `proyectos/web/trabajamos-com/idea/pruebas-fase2.md`.

## Looks del lote paralelo (2026-11-03)

| Look | Carpeta | Rama Git (`proyectos`) | Skills (resumen) |
| :--- | :--- | :--- | :--- |
| **A LinkedIn / profesional** | [look-linkedin/](look-linkedin/README.md) | `cursor/look-linkedin-aa58` | linkedin-profile + indeed-cl + redesign |
| **B Elegante / Pearl** | [look-elegante/](look-elegante/README.md) | `cursor/look-elegante-aa58` | high-end-visual-design + taste + redesign |
| **C Moderno colorido** | [look-colorido/](look-colorido/README.md) | `cursor/look-colorido-aa58` | taste (dials altos) + redesign (+ IA producto) |
| **C1 Syne denso** | [look-c-tipo/c1-syne/](look-c-tipo/c1-syne/README.md) | `cursor/look-c-tipo-syne-aa58` @ `8542b742` | Fork de tipo de C (archivado) |
| **C2 Editorial** | [look-c-tipo/c2-editorial/](look-c-tipo/c2-editorial/README.md) | `cursor/look-c-tipo-editorial-aa58` @ `e9a803dc` | Fork de tipo de C (archivado) |
| **C3 Jakarta** | [look-c-tipo/c3-jakarta/](look-c-tipo/c3-jakarta/README.md) | `cursor/look-c-tipo-jakarta-aa58` @ `0d3578ce` | Fork de tipo de C — **candado tipográfico** |

Dirección de look elegida: **C**. Candado de tipo: **C3 Jakarta**. C1 y C2 son alternativas archivadas. Índice: [look-c-tipo/](look-c-tipo/README.md).

Catálogo completo de skills: [`../../catalogo-skills.md`](../../catalogo-skills.md).

## Invariantes de producto (todos los looks)

- Ids búsqueda: `#form-buscar`, `#q`, `#localidad`, `#usar-ubicacion`, `#ubicacion-actual`, `#estado-busqueda`, `#reintentar`, `#resultados`
- Perfil: Contactar (`tel:` / `mailto:` / `https:`) + `#contacto-dato`; secciones contacto / ofertas / portafolio / localidad
- Sin marcas “LinkedIn” / “Indeed” en UI
- Tests: `npm test` en `iterations/v1` (64) al cerrar cada look

## Historial rechazado / previo

Ver `idea/pruebas-fase2.md` en el repo `proyectos`: minimalist, Swiss brutalist, Soft Structuralism isla, Indeed+LinkedIn 4, orgánico 4b.
