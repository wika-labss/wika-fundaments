# Ramon David — Acolchados CD (tenant web)

Instancia **SKU A** sobre el flujo de `web-design`. Marca pública: [Acolchados CD](https://www.acolchadoscd.cl).

| | |
|---|---|
| Ruta canónica | `proyectos/web/ramon-david/` |
| Contrato | `standards/sku-contract.yaml` |
| Docs | [`idea/`](./idea/) (01–05) |
| Auditorías | [`audits/`](./audits/) — listas para firma del arquitecto |
| Salida esperada | [`iterations/v3/`](./iterations/v3/) |
| Copia de release | [`final/`](./final/) |

**Legado:** el sitio Flask + catálogo 19 ítems + Mercado Libre vive en [`wika-labss/proyectos` `app/ramon-david`](https://github.com/wika-labss/proyectos/tree/main/app/ramon-david) (`iterations/v1/`). Ese stack **no** es el tenant v3.

## SKU

`A` — sitio editable, schema fijo (Inicio, 5 líneas, Equipo, Contacto, galería). Panel `/admin`. Sin pagos, sin catálogo infinito, sin login de visitantes.

## Ver v3 en local

```bash
cd proyectos/web/ramon-david/iterations/v3
python3 -m http.server 4173
```

- Público: http://127.0.0.1:4173/
- Admin (demo schema fijo): http://127.0.0.1:4173/admin/
