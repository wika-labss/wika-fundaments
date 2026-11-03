# Producción — API, token y admin

Guía para dejar Scraping TA en `https://ta.vissiuss.com` y para rotar la API o los tokens sin tocar el código. El detalle de Docker y Caddy está en [README.md](README.md).

La API de producción es el origen `https://ta.vissiuss.com`. No uses un túnel (`trycloudflare` u otro) como valor por defecto de la extensión.

## Dónde está el admin

| Qué | Dónde |
| :--- | :--- |
| Página | `https://ta.vissiuss.com` y `https://ta.vissiuss.com/admin` |
| Login | `https://ta.vissiuss.com/login` |
| Código | `scraping-ta/iterations/v1/static/admin.html` |
| Proceso | FastAPI en el contenedor `app` (puerto 8000). Caddy publica 80/443 y hace `reverse_proxy` a ese proceso. |

El admin tiene dos módulos:

- **Informes** — historial y descarga del Excel de cada corrida.
- **Token** — estado de `INGEST_KEY` (solo lectura: vive en `.env`) y el token ScrapingBee de respaldo.

La extensión abre el informe, envía los menús, trae Justo, cierra el informe y descarga el Excel. El admin no abre ni cierra informes.

## 1. DNS

En el panel de `vissiuss.com`:

| Tipo | Nombre | Valor |
| :--- | :--- | :--- |
| `A` | `ta` | IP pública del VPS |

Comprobá que resuelva antes de pedir el certificado:

```bash
dig +short ta.vissiuss.com
```

Puertos **80** y **443** abiertos. Sin ese registro, `https://ta.vissiuss.com` no existe y la extensión muestra que no llega al servidor.

## 2. API nueva

La API es el origen, sin path y sin barra final:

```text
https://ta.vissiuss.com
```

La extensión llama, con `Authorization: Bearer <INGEST_KEY>`:

| Acción | Método y ruta |
| :--- | :--- |
| Abrir informe | `POST /api/jobs` |
| Enviar menú | `POST /api/ingest` |
| Traer Justo | `POST /api/jobs/{id}/justo` |
| Cerrar informe | `POST /api/jobs/{id}/close` |
| Ver estado | `GET /api/audit/{id}` |
| Descargar Excel | `GET /api/report/{id}.xlsx` |

`/api/reports` (el historial) sigue pidiendo la cookie de admin. El Bearer de la extensión no entra ahí.

En el popup, el campo **API** tiene que ser exactamente ese origen. Si todavía figura un túnel de prueba, reemplazalo y guardá el campo (se pierde el foco o se cambia el valor).

Para apuntar a otro host (otro VPS o un staging), cambiá `DOMAIN` en `.env`, el registro DNS y `host_permissions` de `extension/manifest.json`. Chrome bloquea el `fetch` del popup si el origen no está en ese manifiesto. Después recargá la extensión en `chrome://extensions`.

Local, sin Docker: `http://127.0.0.1:8000`.

## 3. Token nuevo de la extensión (`INGEST_KEY`)

Generá una clave y no la subas a git:

```bash
openssl rand -hex 32
```

En el VPS:

```bash
cd scraping-ta/deploy
cp -n .env.example .env
nano .env
```

```bash
DOMAIN=ta.vissiuss.com
ACME_EMAIL=ops@vissiuss.com
INGEST_KEY=<la clave de arriba>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<una clave que no sea cambiar123>
SCRAPING_TA_AUTH=1
```

Levantá o reiniciá para que el proceso tome la clave nueva. La anterior deja de servir en ese momento.

```bash
./prepare.sh
docker compose up -d --build
docker compose logs -f app
```

Comprobación:

```bash
curl -sS https://ta.vissiuss.com/api/health
```

Tiene que responder `"ok": true` e `"ingest_configured": true`.

En la extensión, pegá **la misma** clave en **INGEST_KEY**. Queda en `chrome.storage.local` de ese Chrome. Si rotás la clave en el servidor, hay que pegarla de nuevo en cada navegador que use la extensión.

## 4. Usuario y clave del admin

`ADMIN_USERNAME` y `ADMIN_PASSWORD` en el mismo `.env`. `SCRAPING_TA_AUTH=1` obliga el login.

Después de `docker compose up -d --build`, entrá en `https://ta.vissiuss.com/login`. Cambiá `cambiar123` antes de dejar el sitio publicado.

La sesión es la cookie `sta_admin`. No es el token de la extensión.

## 5. Token ScrapingBee (opcional)

Solo el fallback. La extensión no lo usa. Justo en `tarragona.cl` sale del CDN y no gasta créditos.

Dos lugares, y gana el entorno:

1. `SCRAPINGBEE_API_KEY` en `.env`. Si tiene valor, el servidor usa esa clave aunque alguien guarde otra en el admin.
2. Admin → **Token** → **Token ScrapingBee**. Se escribe en `deploy/data/.scrapingbee_key` (volumen, no va a git). Se usa solo cuando `SCRAPINGBEE_API_KEY` está vacío.

Para rotar el token desde el admin, dejá `SCRAPINGBEE_API_KEY` vacío, reiniciá el contenedor y guardá el token nuevo en la página.

## 6. Cargar la extensión

1. Chrome → `chrome://extensions` → **Modo de desarrollador**.
2. **Cargar extensión sin empaquetar** → `scraping-ta/extension`.
3. Si ya estaba cargada, **Recargar** después de actualizar el repo (versión `1.3.0`).
4. API: `https://ta.vissiuss.com`.
5. Pegá `INGEST_KEY`.
6. **Nuevo informe** → abrí el menú (PedidosYa, Uber Eats o Rappi) → **Enviar menú**. Justo: **Traer Justo**. **Cerrar informe**. **Descargar informe**.

Un informe `collecting` sigue recibiendo envíos. Al cerrarlo, o al abrir otro, queda cerrado y un envío posterior responde 409. El Excel se puede descargar con el informe cerrado, sin abrir el admin.

## Qué no commitear

`.env`, `deploy/data/`, `INGEST_KEY`, la clave de admin y el token ScrapingBee.
