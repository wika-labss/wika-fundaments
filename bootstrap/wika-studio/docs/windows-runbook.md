# Runbook Windows — WIKA Studio 0.2.0

Cómo instalar, entrar y levantar un preview en Windows. El código UI-B vive en
`wika-fundaments` (`bootstrap/wika-studio`) hasta publicarse en `wika-labss/wika-studio`.

Rama: `cursor/wika-studio-bootstrap-ba99`.

## Dos carpetas (no las mezcles)

| Carpeta | Qué es | Qué no tiene |
|---------|--------|----------------|
| `C:\Users\jleiva\wika-fundaments` | SCOS + semilla Studio | No se corre `npm run dev` aquí para la UI |
| `C:\Users\jleiva\wika-studio-app` | Copia de trabajo (0.2.0) | No tiene `sync-wika-studio.ps1` hasta que lo copies |

`sync-wika-studio.ps1` y `write-owner-env.mjs` **no existen** en el Studio 0.1.0. Se corren desde `wika-fundaments`.

## Arranque (primera vez o tras un fallo)

En PowerShell, **desde `wika-fundaments`**:

```powershell
cd C:\Users\jleiva
if (-not (Test-Path .\wika-fundaments)) {
  git clone https://github.com/wika-labss/wika-fundaments.git
}
cd C:\Users\jleiva\wika-fundaments
if (-not (git remote get-url origin 2>$null)) {
  git remote add origin https://github.com/wika-labss/wika-fundaments.git
}
git fetch origin cursor/wika-studio-bootstrap-ba99
git checkout cursor/wika-studio-bootstrap-ba99
git pull origin cursor/wika-studio-bootstrap-ba99

.\scripts\sync-wika-studio.ps1 -Destination C:\Users\jleiva\wika-studio-app -Email tu@correo -Password "tu-clave"

cd C:\Users\jleiva\wika-studio-app
Get-Content package.json | Select-String '"version"'
Test-Path .\scripts\write-owner-env.mjs
npm install
npm run dev
```

Comprueba:

- `package.json` dice `"version": "0.2.0"`
- `scripts\write-owner-env.mjs` existe (`True`)
- El BFF imprime `wika-studio BFF http://127.0.0.1:3001/api/v1`
- El BFF imprime `owners: 1  hash: sí`
- Vite: http://127.0.0.1:5173/

Entra con **el mismo correo y clave** que pasaste a `-Email` / `-Password`. No es la contraseña de Windows.

## Actualizar después de un fix

```powershell
# Ctrl+C en npm run dev
cd C:\Users\jleiva\wika-fundaments
git pull origin cursor/wika-studio-bootstrap-ba99
.\scripts\sync-wika-studio.ps1 -Destination C:\Users\jleiva\wika-studio-app
cd C:\Users\jleiva\wika-studio-app
npm run dev
```

El `.env` no se sobrescribe (el sync lo excluye). Los proyectos en `fixtures/proyectos` o `WIKA_PROYECTOS_ROOT` se reutilizan.

## IA real (opcional)

Edita `C:\Users\jleiva\wika-studio-app\.env` en VS Code (no Notepad):

```
CURSOR_API_KEY=...
STUDIO_AGENT_RUNTIME=cursor-sdk
```

Reinicia `npm run dev`. Si la key falla, el login no debe caerse: verás aviso de modelos.

## Fallos vistos en Windows (2026-10-27)

### `sync-wika-studio.ps1` / `write-owner-env.mjs` no se reconoce

Corriste el comando **dentro de `wika-studio-app`**. El script está en `wika-fundaments\scripts\`.

### Internal Server Error al entrar

Causa: `.env` en UTF-16 (Notepad / `Set-Content`) o `STUDIO_PASSWORD_HASH` incompleto (`hash-password.mjs` se cuelga sin TTY).

```powershell
cd C:\Users\jleiva\wika-studio-app
node scripts\write-owner-env.mjs --email tu@correo --password "tu-clave"
```

Reinicia el BFF. Debe verse `owners: 1  hash: sí`.

No uses `STUDIO_OWNERS=...` como sintaxis bash en PowerShell.

### Vite: `ECONNREFUSED 127.0.0.1:3001`

El front arrancó; el BFF no. `tsx watch` en Windows se quedaba mudo.

`npm run dev:bff` ahora es `tsx src/index.ts` (sin watch). El boot no carga `@cursor/sdk` hasta que hace falta.

Si el BFF no imprime la línea `wika-studio BFF`, corre solo `npm run dev:bff` y pega esa salida.

### Preview: `deprecated` / `DEP0190` y silencio

No son errores. `npx.cmd` + `shell:true` dejaba Expo sin logs. Studio lanza `node node_modules/expo/bin/cli` (o Vite) y espera HTTP.

Expo web tarda 1–3 min la primera vez. Listo = `preview listo: http://127.0.0.1:4300/`.

### Preview: `dev server terminó (code=1)`

Causa reproducida: Metro de Expo SDK 52 exige `expo-asset`. Sin el paquete, Expo sale con código 1.

Studio 0.2.0+ instala `expo-asset@~11.0.5` si falta y el error incluye las últimas líneas de Expo.

Tras sincronizar: **Detener** y **Levantar preview** en el mismo proyecto (p. ej. `tetris`). No hace falta borrar el proyecto.

Otros `code=1` frecuentes:

- Puerto 4300 ocupado por un Expo colgado → Detener, o mata el `node` huérfano, o espera a que Studio use 4301.
- Node 24: el motor pide **22.13+**; 24 a veces arranca, a veces no. Preferir Node 22 LTS.

## Credenciales

| Campo | Valor |
|-------|--------|
| Email | El de `STUDIO_OWNERS` (el de `-Email`) |
| Contraseña | La que inventaste en `-Password` |
| Cookie | `wika_studio_session` (HttpOnly) |

`scripts/hash-password.mjs` sin argumento se cuelga en PowerShell. Usa `write-owner-env.mjs`.

## URLs

| Servicio | URL |
|----------|-----|
| UI | http://127.0.0.1:5173/ |
| BFF health | http://127.0.0.1:3001/api/v1/health |
| Preview Expo/Vite | http://127.0.0.1:4300/ … 4399 |

## Criterio de hecho local

1. Dueño entra; un extraño recibe 403.
2. Proyecto exploración (móvil/juego → Expo, web → Vite).
3. Preview `ready` en el DeviceFrame.
4. Chat `wika-builder` (mock o Cursor) edita `iterations/prototype/` y el iframe recarga.
5. Un intento de `ready_for_construction: true` o archivo fuera de `prototype/` se revierte (`guard.violation`).
