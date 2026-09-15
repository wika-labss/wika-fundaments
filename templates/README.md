# Templates

Plantillas oficiales de documentación de proyecto. Copiar a `proyectos/app/{proyecto}/idea/`.

## Ciclo de vida

```text
Preparación (01–02)
↓
Auditoría de Documentación     → audit_1_passed
↓
Descubrimiento de Módulos (03)
↓
Auditoría de Módulos           → audit_2_passed
↓
Diseño de Aplicación (04)
↓
Aprobación Visual              → visual_approval_passed
↓
Plan de Construcción (05)
↓
Auditoría de Ensamblado        → audit_3_passed
↓
Listo para construir           → ready_for_construction
↓
Construcción V1
↓
Auditoría de Release           → audits/auditoria-release-v1.md
```

`05-build-plan.md` es **entrada** de la Auditoría de Ensamblado, no un paso posterior.

## Plantillas

| Archivo | ID | Gate principal |
|---------|-----|----------------|
| `01-problem.md` | PROB-001 | RTM origen (`ERR-XX`) |
| `02-features.md` | FEAT-001 | BDD + NFRs (Gate 1 junto con 01) |
| `03-module-discovery.md` | MOD-001 | Contratos modulares |
| `04-application-design.md` | DES-001 | Preview + navegación |
| `05-build-plan.md` | BUILD-001 | Cronograma trazable |

## Trazabilidad RTM

```text
ERR-XX (01) → FEAT-XX (02) → MOD-XX (03) → VIEW-XX (04) → Paso N (05)
```

## Estándares relacionados

- `standards/coding-standards.md` — WIKA-ARCH, stack Expo/RN
- `standards/design-system.md` — tokens base V1; pipeline V3+ (12 etapas) en repo `design-system/`
- `.cursorrules` — gates automatizables para agentes IA

## Auditorías

| Flag YAML | Auditoría WIKA |
|-----------|----------------|
| `audit_1_passed` | `docs/auditoria-documentacion.md` |
| `audit_2_passed` | `docs/auditoria-modulos.md` |
| `visual_approval_passed` | Visto bueno arquitecto (04) |
| `audit_3_passed` | `docs/auditoria-ensamblado.md` |
| `ready_for_construction` | Pre-requisito construcción V1 |
| (registro en `audits/`) | `docs/auditoria-release-v1.md` |
