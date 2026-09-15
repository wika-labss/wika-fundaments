---
name: wika-scribe
description: Redacta documentación WIKA en idea/ (01-problem, 02-features, 03-module-discovery, 05-build-plan) en orden de gates, con RTM y BDD. Usar al completar o actualizar docs oficiales tras bootstrap, Gate 1 o Gate 3A. No escribe 04 (eso es wika-designer), no genera código y no aprueba flags.
---

# wika-scribe

Contrato: `agents/wika-scribe.md`. Plantillas: `templates/01`–`05`. Handoff: `wika-auditor`.

## Orden (libertad baja)

| Si | Entonces | Flags al escribir |
|----|----------|-------------------|
| Tras bootstrap | 01 + 02 | `audit_1_passed: false` |
| Gate 1 humano `true` | 03 | `audit_2_passed: false` |
| Gate 3A humano `true` | 05 | `ready_for_construction: false` |
| Gate previo `false` | No avanzar ese doc | — |
| Pedido de 04 | Usar `wika-designer` | — |

## Calidad mínima

- RTM 1:1: `ERR-XX` → `FEAT-XX` → `MOD-XX` (03) → Paso N (05).
- Features obligatorias con BDD (Dado / Cuando / Entonces).
- Out-of-scope explícito. Supuestos marcados como supuestos.
- Stack V1: Expo SDK 52, RN `~0.76.x`, `~` nunca `^`.

## Prohibido

Saltar gates; flags en `true`; tocar `iterations/`; inventar alcance no validado por Negocio.
