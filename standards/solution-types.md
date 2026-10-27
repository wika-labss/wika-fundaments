---
id: "WIKA-SOLUTION-TYPES"
title: "Tipos de solución WIKA"
status: "ACTIVO"
version: "1.0.0"
owner: "Arquitectura WIKA"
created_at: "2026-10-27"
updated_at: "2026-10-27"
---

# Tipos de solución WIKA

## Objetivo

Taxonomía oficial de productos construibles bajo WIKA Studio: apps móviles, juegos, web e híbridos, y su impacto en documentación y runtime.

## Audiencia

Negocio, arquitectos, plantillas `idea/`, Studio.

## Fuente de verdad

Campo `solution_type` en [`templates/01-problem.md`](../templates/01-problem.md).  
Canales: `delivery_channels`.

## Relación con lifecycle y agentes

El lifecycle es **único**; cambian estándares de código, pasos en 05 y scripts de iteración.

## Fuera de alcance

Precios, marketplace de templates.

---

# Valores de `solution_type`

| Valor | Descripción | Engine típico |
|-------|-------------|---------------|
| `mobile_app` | App Expo/RN V1 Android | `src/engine/` + UI |
| `game` | Juego (loop, estado, render UI) | `src/engine/` obligatorio |
| `web_app` | SPA/SSR web | Ver [`coding-standards-web.md`](coding-standards-web.md) |
| `hybrid` | Móvil + web compartiendo engine | Dos targets en 05 |

---

# `delivery_channels`

Array en frontmatter 01:

| Valor | Estándar |
|-------|----------|
| `android` | [`coding-standards.md`](coding-standards.md) |
| `web` | [`coding-standards-web.md`](coding-standards-web.md) |
| `ios` | Futuro; documentar en 05 como excluded V1 si aplica |

---

# Impacto en documentos

| Doc | mobile_app / game | web_app | hybrid |
|-----|-------------------|---------|--------|
| 03-module-discovery | MOD engine + UI | MOD API client + UI | Compartir MOD engine |
| 04-application-design | expo-router | rutas web | dos tablas navegación |
| 05-build-plan | APK verify | static/host verify | pasos por canal |

---

# Impacto en Studio

- Icono/tipo en lista P-01.
- Workspace carga scripts según canal activo.
- Gate 3A puede requerir dos previews si `hybrid`.

---

# Documentos relacionados

- [`coding-standards.md`](coding-standards.md)
- [`coding-standards-web.md`](coding-standards-web.md)
