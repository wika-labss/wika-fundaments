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

## Si ya tienes el repo `wika-studio` en 0.1.0 (Windows)

Esa carpeta **es** Studio; no tiene `bootstrap/`. El código UI-B está en `wika-fundaments` hasta que se publique en `wika-labss/wika-studio`.

```powershell
cd C:\Users\jleiva
git clone https://github.com/wika-labss/wika-fundaments.git
cd wika-fundaments
git fetch origin cursor/wika-studio-bootstrap-ba99
git checkout cursor/wika-studio-bootstrap-ba99
.\scripts\sync-wika-studio.ps1 -Destination C:\Users\jleiva\wika-studio-app

cd C:\Users\jleiva\wika-studio-app
npm install
cd C:\Users\jleiva\wika-studio-app
npm install
node scripts\write-owner-env.mjs --email tu@correo --password "tu-clave"
# opcional IA real: añade CURSOR_API_KEY=... al .env (Notepad: Guardar como UTF-8)
npm run dev
```

`package.json` debe decir `"version": "0.2.0"` y el script `dev` debe usar `concurrently`. Si sigue en `0.1.0`, la copia no se aplicó.

## Inicio rápido

```bash
npm install
npm run dev
```

- Web: http://localhost:5173
- BFF: http://127.0.0.1:3001/api/v1/health

En PowerShell es el mismo comando (`concurrently`); no uses `npm run dev:bff &`.

## Login: Internal Server Error

El 500 al entrar casi siempre es un `.env` mal guardado en Windows (UTF-16 de Notepad/`Set-Content`) o un `STUDIO_PASSWORD_HASH` incompleto (el prompt de `hash-password.mjs` se cuelga sin TTY).

1. En `C:\Users\jleiva\wika-studio-app` corre:

```powershell
node scripts\write-owner-env.mjs --email tu@correo --password "tu-clave"
```

Eso reescribe `.env` en UTF-8. El correo y la clave son los que acabas de pasar, **no** la de Windows.

2. Cierra `npm run dev` (Ctrl+C) y vuelve a arrancarlo. En la consola del BFF debe verse `owners: 1  hash: sí`.
3. Entra en http://localhost:5173 con **ese** correo y **esa** clave.
4. Si quieres IA real, edita `.env` en VS Code (no Notepad) y pon `CURSOR_API_KEY=...`. Si la key falla, el login ya no debe caerse: verás aviso de modelos.

No uses `STUDIO_OWNERS=...` como sintaxis bash en PowerShell. No pegues el hash a mano si puedes usar `write-owner-env.mjs`.

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
