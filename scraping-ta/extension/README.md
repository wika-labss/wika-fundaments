# Extensión Scraping TA (Chrome MV3)

Captura el XHR nativo del menú mientras navegás PedidosYa, Uber Eats o Rappi y lo manda a `POST /api/ingest`. **No** pide cookies, **no** inicia sesión en el marketplace y **no** se publica en Chrome Web Store.

Justo / tarragona.cl no se captura en el navegador: el botón **Traer Justo** le pide al servidor el CDN.

El informe se abre, se cierra y se descarga desde el popup. El admin solo cambia el token ScrapingBee y muestra el historial. Ver [deploy/produccion.md](../deploy/produccion.md).

## Cargar unpacked

1. Chrome → `chrome://extensions`
2. Activá **Modo de desarrollador**
3. **Cargar extensión sin empaquetar** → esta carpeta (`scraping-ta/extension`)
4. Si ya estaba cargada, **Recargar** (versión `1.3.0`)
5. Abrí el popup, pegá `INGEST_KEY` (una vez; queda en `chrome.storage.local`)
6. API por defecto: `https://ta.vissiuss.com`. Para uvicorn local: `http://127.0.0.1:8000`

Si el campo API todavía tiene un túnel de prueba, reemplazalo por `https://ta.vissiuss.com`.

## Uso

1. **Nuevo informe**. Anotá el id que aparece arriba (queda abierto hasta que lo cierres).
2. Abrí el menú del local en Chrome (hay que **ver el menú**, no un captcha).
3. Esperá a que suba el contador de XHR.
4. **Enviar menú**. Repetí en PedidosYa, Uber Eats y Rappi con el mismo informe.
5. **Traer Justo** si hace falta el menú de tarragona.cl.
6. **Cerrar informe**. Después de cerrado no acepta más envíos.
7. **Descargar informe**. El Excel baja en el popup, sin abrir el admin.

Si solo ves el challenge / captcha: **recargá el menú** y reintentá. Sin esa señal nativa no se envía nada:

| Canal | Señal |
| :--- | :--- |
| PedidosYa | XHR `/niles/partners/…/menus` con `sections` |
| Rappi | XHR `restaurants-bus/store/id/` |
| Uber Eats | `__REACT_QUERY_STATE__` en el HTML |

## Qué se envía

`POST {API}/api/ingest` con `Authorization: Bearer <INGEST_KEY>`:

```json
{ "job_id": "id del informe abierto", "platform": "peya|uber|rappi", "source_url": "…", "body": "<html>…", "xhr": [{"url","method","body"}] }
```

No se mandan cookies ni tokens del marketplace. La descarga es `GET {API}/api/report/{id}.xlsx` con el mismo Bearer, y el archivo se arma en el documento del popup (`URL.createObjectURL`). El service worker de Chrome no tiene esa API.
