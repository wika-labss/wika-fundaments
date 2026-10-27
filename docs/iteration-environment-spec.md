---
id: "WIKA-ITER-ENV"
title: "Especificación de entorno por iteración"
status: "ACTIVO"
version: "1.1.0"
owner: "Arquitectura WIKA"
created_at: "2026-10-27"
updated_at: "2026-10-27"
---

# Especificación de entorno por iteración

## Objetivo

Estandarizar **comandos**, URLs de preview y artefactos por carpeta `iterations/{name}/` para que WIKA Studio (UI-B) y CI ejecuten lo mismo.

## Audiencia

Implementadores Studio, agentes builder/refiner, DevOps.

## Fuente de verdad

Stack móvil: [`standards/coding-standards.md`](../standards/coding-standards.md).  
Stack web: [`standards/coding-standards-web.md`](../standards/coding-standards-web.md).  
Canales: [`standards/solution-types.md`](../standards/solution-types.md).

## Relación con lifecycle y agentes

`wika-builder` y `wika-refiner` deben generar scripts listados aquí. Studio invoca estos comandos vía runner local o contenedor.

## Fuera de alcance

Provisionamiento cloud de runners.

---

# Layout mínimo por iteración

```text
iterations/{name}/
├── package.json
├── scripts/
│   ├── wika-dev.mjs
│   ├── wika-verify.mjs
│   └── wika-build-artifact.mjs
├── app/                    # expo-router (mobile/game)
├── assets/                 # imágenes aportadas por el dueño o generadas
├── .wika/logs/             # dev.log (ignorado en git)
└── review.md
```

Web app (canal web):

```text
iterations/{name}/
├── package.json
├── scripts/wika-dev.mjs
├── scripts/wika-verify.mjs
├── scripts/wika-build-artifact.mjs
└── assets/
```

Los scripts son **Node ESM** (`.mjs`) para que corran igual en Windows, macOS y Linux sin depender de `bash`. Las plantillas oficiales (`expo-prototype`, `web-prototype`) viven en el repo `wika-studio` bajo `templates/` y las copia `wika-bootstrap` al crear `iterations/prototype/`.

---

# Comandos estándar

| Script | Propósito | Éxito |
|--------|-----------|-------|
| `wika-dev.mjs` | Servidor desarrollo / preview con hot reload | Mantiene el proceso vivo e imprime `PREVIEW_URL=...` en stdout cuando el servidor está listo |
| `wika-verify.mjs` | typecheck + pruebas WIKA | Exit 0 |
| `wika-build-artifact.mjs` | APK o static web | Exit 0 + `ARTIFACT_PATH=...` |

Contrato de `wika-dev.mjs`:

- Lee `PORT` del entorno (lo asigna Studio); si falta, usa el puerto por defecto del canal.
- Lanza el dev server de la plantilla (`expo start --web --port $PORT` o `vite --port $PORT --strictPort`).
- Imprime exactamente una línea `PREVIEW_URL=http://...` cuando el servidor responde.
- Reenvía stdout/stderr del dev server (Studio los guarda en `.wika/logs/dev.log`).
- Termina con el proceso hijo cuando recibe `SIGTERM`/`SIGINT`.

Aliases npm en `package.json`:

```json
{
  "scripts": {
    "dev": "node scripts/wika-dev.mjs",
    "verify": "node scripts/wika-verify.mjs",
    "build:artifact": "node scripts/wika-build-artifact.mjs"
  }
}
```

---

# Preview por canal

| Canal | PREVIEW_URL típico | Notas |
|-------|-------------------|-------|
| `android` / Expo | `exp://` o tunnel URL | Expo Go / dev client; Studio puede mostrar QR |
| `web` (Expo) | `http://localhost:{PORT}` | Expo web dentro del marco de dispositivo |
| `web_app` (Vite/Next) | `http://localhost:{PORT}` | Ver coding-standards-web |

Studio carga `PREVIEW_URL` en un iframe dentro de un **marco de dispositivo** (teléfono, tablet o escritorio) con rotación y zoom. El marco es visual: el ancho/alto del iframe simula el viewport; no sustituye pruebas en dispositivo real.

---

# Artefactos

| Canal | ARTIFACT_PATH |
|-------|---------------|
| Android APK | `dist/app-release.apk` o salida `build-apk.sh` |
| Web static | `dist/` zip o carpeta |

---

# prototype vs vN

| Carpeta | verify obligatorio antes de share | Release |
|---------|-----------------------------------|---------|
| `iterations/prototype/` | Recomendado | No |
| `iterations/v1+` | Obligatorio | Sí (construction) |

---

# Logs

Convención: `iterations/{name}/.wika/logs/dev.log` — Studio tail vía API. `.wika/logs/` y `node_modules/` deben estar en el `.gitignore` de la iteración.

---

# Documentos relacionados

- [`exploration-vs-construction.md`](../workflows/exploration-vs-construction.md)
- [`studio-api-contract.md`](studio-api-contract.md)
