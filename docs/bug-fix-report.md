# Informe de corrección de bugs — wika-fundaments

**Fecha:** 2026-09-15  
**Analizador:** Cursor Grok 4.6 (Cloud Agent)  
**Rama:** `cursor/docs-consistency-bugs-f1f9`  
**Repositorio:** `wika-labss/wika-fundaments` (rama base `wika-fundaments-v2`)

## Overview

| Métrica | Valor |
|---------|-------|
| Total bugs encontrados | 13 verificables + 3 diferidos |
| Total bugs corregidos | 13 |
| Sin corregir / diferidos | 3 |
| Cobertura de tests | 0% (sin suite) → suite nueva de consistencia documental |
| Stack analizado | Markdown / YAML de proceso (SCOS). No hay código de aplicación. |

Este repositorio **no es una aplicación**: es el sistema operativo de desarrollo WIKA (plantillas, auditorías, estándares, workflows). No existen `src/`, dependencias npm/pip de producto, ni superficie de SQL/XSS/CSRF. Los bugs verificables son **inconsistencias de contrato** que provocan que agentes IA y humanos construyan en la ruta incorrecta, salten gates o apunten a archivos inexistentes.

## Hallazgos críticos

1. **BUG-001** — `workflows/application-lifecycle.md` describía el flujo antiguo de 2 auditorías (`auditoria-1.md` / `auditoria-2.md`) incompatible con las plantillas v2.1 y `.cursorrules`.
2. **BUG-002 / BUG-012** — `README.md` listaba archivos inexistentes y tenía un fence Markdown sin cerrar, de modo que la estructura del repo se renderizaba dentro de un bloque de código.
3. **BUG-003** — Doble ruta canónica (`applications/` vs `proyectos/app/`) en documentos oficiales.
4. **BUG-004** — Faltaba `docs/auditoria-release-v1.md`, citada como gate de cierre.
5. **BUG-006** — `docs/repositories.md` declaraba Flutter como stack de `mobile-template` mientras `standards/coding-standards.md` exige Expo SDK 52 + React Native.

## Resumen por categoría

| Categoría | Corregidos |
|-----------|------------|
| Seguridad | 0 (sin superficie de runtime en este repo) |
| Funcional (contrato de proceso) | 8 |
| Integración (enlaces / nombres de archivo) | 3 |
| Code Quality (docs) | 2 |
| Performance | 0 |

## Lista detallada

| BUG-ID | Severidad | Archivo | Descripción | Estado | Test |
|--------|-----------|---------|-------------|--------|------|
| BUG-001 | CRITICAL | `workflows/application-lifecycle.md` | Ciclo de 2 auditorías vs gates v2.1; refs rotas | FIXED | `test_canonical_path_in_lifecycle` |
| BUG-002 | HIGH | `README.md` | Árbol con `auditoria-1.md`, `auditoria-2.md`, `bodega.md` | FIXED | `test_repo_passes_after_fix` |
| BUG-003 | HIGH | `docs/documentation.md`, `docs/repositories.md`, README | Ruta `applications/` vs `proyectos/app/` | FIXED | `test_bug003_*` + live repo |
| BUG-004 | HIGH | `docs/auditoria-release-v1.md` (ausente) | Gate de release citado y sin documento | FIXED | `test_release_audit_exists_and_is_linked` |
| BUG-005 | MEDIUM | `.cursorrules` | Pipeline DS 10 etapas vs 12 (v2) | FIXED | `test_cursorrules_pipeline_12` |
| BUG-006 | MEDIUM | `docs/repositories.md` | Flutter vs Expo/RN | FIXED | `test_bug006_*` |
| BUG-007 | MEDIUM | `documentation.md`, `repositories.md` | Faltaba `audits/` en la estructura de proyecto | FIXED | live repo |
| BUG-008 | LOW | `templates/02-features.md` | Flag `audit_2_passed` en Gate 1 | FIXED | `test_features_template_has_no_audit_2_flag` |
| BUG-009 | MEDIUM | `templates/README.md` | Plan de construcción colocado *después* del ensamblado | FIXED | live repo |
| BUG-010 | LOW | README ciclo | Omitía Aprobación Visual (Gate 3A) | FIXED | live repo |
| BUG-011 | MEDIUM | `docs/auditoria-release.md` (main) | Documento de release nunca mergeado a v2 | FIXED (restaurado como `-v1`) | `test_release_audit_exists_and_is_linked` |
| BUG-012 | HIGH | `README.md` | Fence ` ```text ` sin cerrar | FIXED | `test_bug012_*` |
| BUG-013 | LOW | `ROADMAP.md` / CONTRIBUTING | Roadmap citaba repo `applications`; sin comando de validación | FIXED | live repo |

## Fichas (plantilla 3.1)

### BUG-001

- **Severity:** CRITICAL  
- **Category:** Functional  
- **Component:** Workflow oficial  
- **Current:** Auditoría 1 (todos los docs + JDK/Kotlin) → generación IA → Auditoría 2 (código). Apunta a `docs/auditoria-1.md` y `docs/auditoria-2.md`.  
- **Expected:** Gates v2.1: Documentación → Módulos → Visual → Ensamblado → Construcción → Release.  
- **Root cause:** `application-lifecycle.md` no se actualizó en la integración de plantillas v2.1 (`42da0c5`). Los archivos se renombraron en `main` (`70080e3`, `16bc55a`) y v2 quedó desfasada.  
- **Impact:** Agentes que lean el workflow oficial saltan RTM/BDD/visual y buscan auditorías inexistentes.  
- **Reproduction:** Abrir `workflows/application-lifecycle.md` (pre-fix) y contrastar con `.cursorrules`.  
- **Verification:** `python3 -m unittest tests.test_validate_docs`

### BUG-003

- **Severity:** HIGH  
- **Category:** Integration  
- **Current:** `applications/<proyecto>/idea/` en README y `documentation.md`; `proyectos/app/{proyecto}/` en plantillas, instructivo y `.cursorrules`.  
- **Expected:** Una sola ruta: `proyectos/app/{proyecto}/`.  
- **Impact:** Proyectos creados en el lugar incorrecto; los agentes no encuentran `idea/` ni `audits/`.

### BUG-004 / BUG-011

- **Severity:** HIGH  
- **Category:** Integration  
- **Current:** Instructivo y `05-build-plan.md` exigen `auditoria-release-v1.md`. El archivo existía en `origin/main` como `docs/auditoria-release.md` (`08fd969`) y no estaba en `wika-fundaments-v2`.  
- **Expected:** Checklist oficial en `docs/auditoria-release-v1.md`.

## Evaluación de riesgo

### Issues diferidos

| ID | Motivo |
|----|--------|
| DEF-001 | Catálogo nominativo de agentes en `agents/` vacío — está en ROADMAP; inventar agentes violaría "documentación es contrato". |
| DEF-002 | Enlace a repo hermano `design-system/Design System.md` no se puede verificar desde este checkout. |
| DEF-003 | PRs abiertos ajenos (`#3` demo de botones contradice CONTRIBUTING; `#4` registro web-design; `#5` tooling QA). No se mergean aquí. |

### Próximos pasos recomendados

1. Ejecutar `python3 scripts/validate_docs.py` en CI de `wika-fundaments-v2` (workflow añadido).
2. Completar definiciones reales en `agents/` cuando exista el catálogo de negocio.
3. Decidir si el PR `#4` (web-design) debe entrar al mapa de `repositories.md`.
4. En el repo `proyectos`, auditar que ningún producto siga usando la raíz `applications/`.

### Deuda técnica

- Duplicación residual de contenido entre instructivo, lifecycle y `.cursorrules` (mitigada: ahora coinciden; sigue siendo tres superficies).
- Ausencia de schema YAML machine-readable para flags (hoy son frontmatter en Markdown).
- Sin suite de producto: este repo no genera cobertura de código de aplicación.

## Resultados de testing

- **Comandos:**
  - `python3 scripts/validate_docs.py`
  - `python3 -m unittest tests.test_validate_docs`
- **Tests añadidos:** 11 (extracción de enlaces, fences, regresiones BUG-001/003/005/006/012, live repo, release doc, flag 02, pipeline 12).
- **Impacto de cobertura:** primera suite del repositorio.

## Entregables machine-readable

- [bug-fix-report.json](bug-fix-report.json)
- [bug-fix-report.yaml](bug-fix-report.yaml)
- [bug-fix-report.csv](bug-fix-report.csv)
