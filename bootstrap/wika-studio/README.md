# WIKA Studio

Consola web y BFF para operar el [SCOS WIKA](https://github.com/wika-labss/wika-fundaments): crear proyectos, chatear con los agentes nominales, ver la demo en un simulador de dispositivo y volver atrás con checkpoints.

**Especificación:** `wika-fundaments` (`docs/studio-product-spec.md`, `docs/studio-api-contract.md` v1.1, `docs/agent-orchestration.md`).

## Requisitos

- Node.js **22.13+** (el SDK de Cursor lo exige)
- npm 10+
- Clone de [`wika-fundaments`](https://github.com/wika-labss/wika-fundaments) (agentes, `.cursorrules`, plantillas 01–05)
- Repo o carpeta `proyectos` (si no existe, Studio puede usar `fixtures/proyectos` o inicializar git al crear el primer proyecto)
- Para IA real: API key de Cursor (Dashboard → API Keys) en `.env` como `CURSOR_API_KEY`

Sin API key el BFF arranca en runtime **mock**: sirve para probar la UI, el preview y la guarda de gates con ediciones deterministas. No usar mock en producción.

## Configuración

```bash
cp .env.example .env
node scripts/write-owner-env.mjs --email tu@correo --password "tu-clave"
```

Variables principales (ver `.env.example`):

| Variable | Uso |
|----------|-----|
| `STUDIO_OWNERS` | Emails de dueños, separados por coma |
| `STUDIO_PASSWORD_HASH` | Hash scrypt de la contraseña compartida |
| `CURSOR_API_KEY` | Solo en el BFF; nunca llega al navegador |
| `WIKA_PROYECTOS_ROOT` | Raíz del repo `proyectos` (contiene `app/`) |
| `WIKA_FUNDAMENTS_ROOT` | Clon de `wika-fundaments` |
| `HOST` | Default `127.0.0.1` |

## Windows

Runbook (arranque, sync, login, preview Expo): [`docs/windows-runbook.md`](docs/windows-runbook.md).

`sync-wika-studio.ps1` se corre **desde `wika-fundaments`**, no desde `wika-studio-app` (el 0.1.0 no tiene esos scripts).

## Inicio rápido

```bash
npm install
npm run dev
```

- Web: http://localhost:5173
- BFF: http://127.0.0.1:3001/api/v1/health

En PowerShell es el mismo comando (`concurrently`); no uses `npm run dev:bff &`.

Fallos Windows (500 al login, BFF mudo, Expo `code=1`): [`docs/windows-runbook.md`](docs/windows-runbook.md).

## Uso (criterio de hecho del MVP)

1. Entra con un email de `STUDIO_OWNERS`. Cualquier otro recibe 403.
2. Crea un proyecto en modo **exploración** (móvil o web). Studio copia `templates/expo-prototype` o `templates/web-prototype` a `iterations/prototype/`.
3. Pulsa **Levantar preview**. El marco simula iPhone / Android / tablet / escritorio.
4. En el chat (agente `wika-builder`, modelo a elección) escribe p. ej. *agrega un botón rojo con el texto "Comprar" y un ícono de carrito*. El preview se actualiza por hot reload y queda un checkpoint.
5. Cambia de modelo entre mensajes. Restaura un checkpoint desde la timeline.
6. Un intento de escribir `ready_for_construction: true` o archivos fuera de `prototype/` se revierte y se reporta (`guard.violation`).

## Estructura

```text
apps/web/                 UI (login, workspace, chat, DeviceFrame)
apps/bff/                 API v1 + agentes + preview + checkpoints
packages/wika-client/     Tipos del contrato
templates/expo-prototype  Expo SDK 52 / RN 0.76 (versiones ~)
templates/web-prototype   Vite + React
scripts/hash-password.mjs     Genera STUDIO_PASSWORD_HASH
scripts/write-owner-env.mjs   Reescribe .env UTF-8 (Windows)
docs/windows-runbook.md       Arranque y fallos en Windows
```

## Scripts

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | BFF + web |
| `npm run typecheck` | TypeScript de los tres paquetes |
| `npm test` | Tests del BFF (auth, gates, flujo mock) |
| `npm run hash-password` | Hash para `.env` (mejor `write-owner-env`) |
| `npm run write-owner-env` | Reescribe `.env` UTF-8 con dueño + hash |

## Licencia

Uso interno WIKA.
