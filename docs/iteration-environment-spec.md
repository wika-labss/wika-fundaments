---
id: "WIKA-ITER-ENV"
title: "Especificación de entorno por iteración"
status: "ACTIVO"
version: "1.0.0"
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
│   ├── wika-dev.sh
│   ├── wika-verify.sh
│   └── wika-build-artifact.sh
├── app/                    # expo-router (mobile/game)
└── review.md
```

Web app (canal web):

```text
iterations/{name}/
├── package.json
├── scripts/wika-dev.sh
├── scripts/wika-verify.sh
└── scripts/wika-build-artifact.sh
```

---

# Comandos estándar

| Script | Propósito | Éxito |
|--------|-----------|-------|
| `wika-dev.sh` | Servidor desarrollo / preview | Exit 0 + imprime `PREVIEW_URL=...` |
| `wika-verify.sh` | typecheck + pruebas WIKA | Exit 0 |
| `wika-build-artifact.sh` | APK o static web | Exit 0 + `ARTIFACT_PATH=...` |

Aliases npm recomendados en `package.json`:

```json
{
  "scripts": {
    "dev": "bash scripts/wika-dev.sh",
    "verify": "bash scripts/wika-verify.sh",
    "build:artifact": "bash scripts/wika-build-artifact.sh"
  }
}
```

---

# Preview por canal

| Canal | PREVIEW_URL típico | Notas |
|-------|-------------------|-------|
| `android` / Expo | `exp://` o tunnel URL | Expo dev client |
| `web` (Expo) | `http://localhost:8081` | Expo web |
| `web_app` (Vite/Next) | `http://localhost:5173` o `3000` | Ver coding-standards-web |

Studio iframe usa `PREVIEW_URL` reportado al terminar `wika-dev.sh`.

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

Convención: `iterations/{name}/.wika/logs/dev.log` — Studio tail vía API.

---

# Documentos relacionados

- [`exploration-vs-construction.md`](../workflows/exploration-vs-construction.md)
- [`studio-api-contract.md`](studio-api-contract.md)
