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

Catálogo completo de skills: [`../../catalogo-skills.md`](../../catalogo-skills.md).

## Invariantes de producto (todos los looks)

- Ids búsqueda: `#form-buscar`, `#q`, `#localidad`, `#usar-ubicacion`, `#ubicacion-actual`, `#estado-busqueda`, `#reintentar`, `#resultados`
- Perfil: Contactar (`tel:` / `mailto:` / `https:`) + `#contacto-dato`; secciones contacto / ofertas / portafolio / localidad
- Sin marcas “LinkedIn” / “Indeed” en UI
- Tests: `npm test` en `iterations/v1` (64) al cerrar cada look

## Historial rechazado / previo

Ver `idea/pruebas-fase2.md` en el repo `proyectos`: minimalist, Swiss brutalist, Soft Structuralism isla, Indeed+LinkedIn 4, orgánico 4b.
