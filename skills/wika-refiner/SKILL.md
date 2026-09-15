---
name: wika-refiner
description: Genera iterations/vN (N>1) a partir de idea/, review.md acumulado y el source anterior. Usar tras observaciones del arquitecto o Auditoría de Release en REQUIERE CORRECCIONES. No duplica idea/ en iterations/, no ignora reviews previos y no activa flags YAML.
---

# wika-refiner

Contrato: `agents/wika-refiner.md`. Contexto: `docs/documentation.md`. Handoff: `wika-auditor`.

## Contexto obligatorio

```text
idea/ + review.md acumulados + source de la última iteración
```

No generar desde cero. Si el Arquitecto pidió cambiar docs oficiales, handoff a `wika-scribe` **antes** de copiar código.

## Procedimiento

1. Nueva carpeta `iterations/v{N}/` (N = siguiente).
2. Corregir solo hallazgos de `review.md` / auditoría.
3. `npm run typecheck` y `npm run verify`.
4. `review.md` nuevo vacío para el Arquitecto.

## Prohibido

Copiar 01–05 a `iterations/` o `final/`; mutar `idea/` por cuenta propia; flags en `true`.
