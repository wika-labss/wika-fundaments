---
name: wika-auditor
description: Redacta borradores de auditoría WIKA (documentación, módulos, ensamblado, release) con gaps concretos. Usar al pedir revisión de idea/, checklist de gate, validar RTM/BDD, o preparar release de iterations/vN. Nunca escribe APROBADO ni pone audit_*_passed, visual_approval_passed o ready_for_construction en true.
---

# wika-auditor

Contrato: `agents/wika-auditor.md`. Handoff: Arquitecto humano.

## Elegir checklist

| Gate | Entrada | Checklist |
|------|---------|-----------|
| 1 | 01+02 | `docs/auditoria-documentacion.md` |
| 2 | 03 | `docs/auditoria-modulos.md` |
| 3B | 04+05 | `docs/auditoria-ensamblado.md` |
| Release | `iterations/vN` + typecheck/verify | `docs/auditoria-release-v1.md` |

Leer la checklist **completa**. No omitir ítems.

## Output

Escribir `proyectos/app/{proyecto}/audits/<archivo>.md`:

- Estado: `PENDIENTE_ARQUITECTO` o `REQUIERE_CORRECCIONES`.
- Gaps con ID (ERR/FEAT/MOD/NFR) y evidencia.
- Siguiente agente sugerido (`wika-scribe` / `wika-designer` / `wika-refiner`).

Nunca `APROBADO`. Nunca mutar frontmatter de `idea/` a `true`.
