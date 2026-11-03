# Scraping TA — V1 (web)

Auditoría de menú vista cliente. Proceso de parsers: [docs/PROCESO.md](docs/PROCESO.md). Docs de producto: [`../../idea/`](../../idea/). Extensión Chrome: [`../../extension/`](../../extension/). Producción: [`../../deploy/produccion.md`](../../deploy/produccion.md).

## Levantar

Python 3.11+ (venv).

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
export INGEST_KEY=$(openssl rand -hex 32)   # la misma se pega en la extensión
export SCRAPING_TA_AUTH=0                   # tests / local sin login
python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

Abrir [http://127.0.0.1:8000/login](http://127.0.0.1:8000/login) (`admin` / `cambiar123`). Consola: `/` y `/admin`.

## Uso

1. Cargá la extensión unpacked (`../../extension/`, ver su README).
2. Popup: `INGEST_KEY` y API `http://127.0.0.1:8000` (local) o `https://ta.vissiuss.com`.
3. **Nuevo informe** en la extensión.
4. Abrí el menú en Chrome (Peya / Uber / Rappi) → **Enviar menú**.
5. Justo: **Traer Justo** en la extensión (servidor, 0 créditos).
6. **Cerrar informe** y **Descargar informe** en la extensión.

El admin (`static/admin.html`, servido en `/` y `/admin`) queda para el historial y el token ScrapingBee. No abre ni cierra informes.

## Fallback ScrapingBee

En **Token**. 1 request ≈ 75 créditos. No es el camino primario. Si `SCRAPINGBEE_API_KEY` está en el entorno, esa clave gana sobre la guardada en el admin.

## Tests

```bash
SCRAPING_TA_AUTH=0 python -m pytest tests -q
```

`conftest.py` ya pone `SCRAPING_TA_AUTH=0`. Los tests de ingest usan un dump sintético (sin red).

## Token / secretos

Nunca commitear `INGEST_KEY` ni la key Bee.
