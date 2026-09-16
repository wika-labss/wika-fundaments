# Templates

Plantillas oficiales de documentación web. Copiar a `proyectos/web/{proyecto}/idea/`.

## Ciclo

```text
Preparación (01–02) + SKU A|B
↓
Auditoría de Documentación     → audit_1_passed
↓
Descubrimiento de Módulos (03) + MOD-DIR
↓
Auditoría de Módulos           → audit_2_passed
↓
HTML estructural (04)
↓
Aprobación Visual              → visual_approval_passed
↓
Plan de Construcción (05)      → hoja de ruta, deps, stack
↓
Auditoría de Ensamblado        → audit_3_passed
↓
Listo para construir           → ready_for_construction (en 05)
↓
Fase 1 HTML semántico          → construction_phase_complete
↓
Fase 2 diseño (taste-skill)
↓
Auditoría de Release           → audits/auditoria-release-v1.md (vs SKU)
```

`05-build-plan.md` es **entrada** de la Auditoría de Ensamblado. `ready_for_construction` vive ahí, no en 04.

Contrato A/B: `standards/sku-contract.yaml`. Tesis: `docs/plan-de-negocio-web/`.

## Plantillas

| Archivo | ID | Gate principal |
|---------|-----|----------------|
| `01-problem.md` | WEB-PROB-001 | RTM origen (`ERR-XX`) + `sku` A\|B |
| `02-features.md` | WEB-FEAT-001 | BDD + secciones/CTAs; `sku` = 01 |
| `03-module-discovery.md` | WEB-MOD-001 | Contratos modulares + MOD-DIR; admin solo A |
| `04-html-design.md` | WEB-HTML-001 | Wireframe, `direction_skill`, Fase 1/2 |
| `05-build-plan.md` | WEB-BUILD-001 | Hoja de ruta, deps, stack canónico |

## Trazabilidad RTM

```text
ERR-XX (01) → FEAT-XX (02) → MOD-XX (03) → VIEW-XX (04) → Paso N (05)
```

## Auditorías

| Flag YAML | Auditoría WIKA |
|-----------|----------------|
| `audit_1_passed` | `docs/auditoria-documentacion.md` (incluye SKU) |
| `audit_2_passed` | `docs/auditoria-modulos.md` (solo en 03) |
| `visual_approval_passed` | Visto bueno arquitecto (04) |
| `audit_3_passed` | `docs/auditoria-ensamblado.md` |
| `ready_for_construction` | Pre-requisito Fase 1 (**05**) |
| `construction_phase_complete` | Pre-requisito Fase 2 (04) |
| (registro en `audits/`) | `docs/auditoria-release-v1.md` |
