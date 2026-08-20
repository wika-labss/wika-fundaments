# Templates

Plantillas oficiales de documentación de proyecto. Copiar a `proyectos/app/{proyecto}/idea/`.

## Ciclo de vida

```text
Idea (01–05)
↓
Auditoría de Documentación     → audit_1_passed
↓
Descubrimiento de Módulos
↓
Auditoría de Módulos           → audit_2_passed
↓
Diseño de Aplicación
↓
Aprobación Visual              → visual_approval_passed
↓
Auditoría de Ensamblado        → audit_3_passed
↓
Plan de Construcción           → ready_for_construction
↓
Construcción V1
```

## Plantillas

| Archivo | ID | Gate principal |
|---------|-----|----------------|
| `01-problem.md` | PROB-001 | RTM origen (`ERR-XX`) |
| `02-features.md` | FEAT-001 | BDD + NFRs |
| `03-module-discovery.md` | MOD-001 | Contratos modulares |
| `04-application-design.md` | DES-001 | Preview + navegación |
| `05-build-plan.md` | BUILD-001 | Cronograma trazable |

## Trazabilidad RTM

```text
ERR-XX (01) → FEAT-XX (02) → MOD-XX (03) → VIEW-XX (04) → Paso N (05)
```

## Estándares relacionados

- `standards/coding-standards.md` — WIKA-ARCH, stack Expo/RN
- `standards/design-system.md` — tokens base V1; pipeline V3+ en repo `design-system/`
- `.cursorrules` — gates automatizables para agentes IA

## Auditorías

| Flag YAML | Auditoría WIKA |
|-----------|----------------|
| `audit_1_passed` | `docs/auditoria-documentacion.md` |
| `audit_2_passed` | `docs/auditoria-modulos.md` |
| `visual_approval_passed` | Visto bueno arquitecto (04) |
| `audit_3_passed` | `docs/auditoria-ensamblado.md` |
| `ready_for_construction` | Pre-requisito construcción V1 |
