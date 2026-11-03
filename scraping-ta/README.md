# Scraping TA

Copia en `wika-fundaments/scraping-ta`. Proyecto WIKA **web** (no APK): auditoría de menú **vista cliente** en PedidosYa, Uber Eats, Rappi y Justo (tarragona.cl).

Fuente de verdad: [`idea/`](idea/). Código V1: [`iterations/v1/`](iterations/v1/).

## Qué hace

Extrae productos, descripciones y precios (cliente + lista) desde JSON nativo — no Partner Catalog. Baja un Excel (`resumen` / `productos` / `comparacion`).

- **Camino principal:** extensión Chrome (`extension/`). Abre el informe, captura el XHR del menú, lo cierra y descarga el Excel. `POST /api/ingest` con `Authorization: Bearer INGEST_KEY`.
- Justo `tarragona.cl`: CDN en el servidor, **0** créditos. Botón **Traer Justo** de la extensión.
- Bee (Peya / Uber / Rappi): fallback en el admin, ~75 créditos, **1 request** por URL.

El admin (`https://ta.vissiuss.com` y `/admin`) solo muestra el historial y el token. No abre informes.

## Levantar V1 (admin Vissiuss)

```bash
cd scraping-ta/iterations/v1
python -m venv .venv
source .venv/bin/activate   # Windows: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
export INGEST_KEY=$(openssl rand -hex 32)
python -m uvicorn app:app --host 127.0.0.1 --port 8000
```

Abrir http://127.0.0.1:8000/login — usuario `admin` / clave `cambiar123`. Extensión: `extension/` (unpacked en `chrome://extensions`), API `http://127.0.0.1:8000`.

Tests locales sin login: `SCRAPING_TA_AUTH=0`.

## Documentación WIKA

| Etapa | Ruta |
| :--- | :--- |
| Problema | `idea/01-problem.md` |
| Features | `idea/02-features.md` |
| Módulos | `idea/03-module-discovery.md` |
| Diseño | `idea/04-application-design.md` |
| Build | `idea/05-build-plan.md` |
| Auditorías | `audits/` |
| Producción (API y tokens) | `deploy/produccion.md` |

Fuera de alcance: APK, login en apps, Partner API, retry loop, bypass Cloudflare.

## Hosting estable (dominio Vissiuss)

Cuando haya VPS + DNS `ta.vissiuss.com` (`A` en `ta` → IP del VPS), no uses trycloudflare. Carpeta lista:

[`deploy/`](deploy/) — Docker, Caddy (HTTPS), `.env.example`. Pasos de API y token: [`deploy/produccion.md`](deploy/produccion.md).

```bash
cd scraping-ta/deploy
./prepare.sh
cp .env.example .env   # DOMAIN=ta.vissiuss.com e INGEST_KEY
docker compose up -d --build
```

Admin: `https://ta.vissiuss.com` y `https://ta.vissiuss.com/admin`. Login: `https://ta.vissiuss.com/login`.
