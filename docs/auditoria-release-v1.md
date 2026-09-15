# Auditoría de Release V1

## Objetivo

Validar que la iteración generada es funcional, compilable y apta para copiarse a `final/` o publicarse.

Esta auditoría representa la validación posterior a Construcción V1 (o a la iteración acordada para release).

Ningún proyecto podrá avanzar a `final/` sin aprobar esta auditoría.

---

# Entradas

## Obligatorias

- Documentación oficial en `proyectos/app/{proyecto}/idea/` (01–05) con gates de construcción en `true`.
- Código de `iterations/vN/` (o la iteración nominada).
- `review.md` de la iteración.
- Resultado de `npm run typecheck` y `npm run verify`.
- Artefacto APK release (o equivalente documentado en `05-build-plan.md`).
- Auditorías previas en `audits/`.

---

# Validaciones

## Compilación y toolchain

- Typecheck sin errores.
- `npm run verify` exitoso.
- Dependencias pinneadas con `~` en expo/react-native (WIKA-ARCH-02).
- JDK/Kotlin/minSdk alineados a WIKA-ARCH-04 si hay prebuild Android.

---

## Release

- APK Release (o artefacto declarado) generado correctamente.
- Versión identificada.
- Sin perfil DEV (Metro) en el binario de distribución (WIKA-ARCH-03 / WIKA-ARCH-05).

---

## Funcionalidad y BDD

- Features obligatorias de `02-features.md` operativas.
- Criterios de éxito BDD de `01-problem.md` cumplidos o desviaciones registradas.
- Casos de uso principales y estados (loading, error, empty) cubiertos si aplica UI.

---

## Arquitectura y estándares

- Trazabilidad RTM (ERR → FEAT → MOD → VIEW → Paso build) respetada en el código.
- `src/engine/` sin imports de React.
- Tokens/theme documentados; 0% hex sueltos cuando existe token equivalente.
- Sin dependencias circulares.

---

## Seguridad

- Permisos Android justificados.
- Secretos fuera del repositorio y del artefacto.
- Sin datos sensibles en logs o storage no documentado.

---

## Documentación

- `review.md` completado por el arquitecto.
- Cambios relevantes registrados.
- Evidencia de construcción disponible.
- Resultado de esta auditoría en `audits/auditoria-release-v1.md`.

---

# Activación

Al aprobar, el arquitecto debe:

1. Registrar resultado **APROBADO** en `audits/auditoria-release-v1.md` del proyecto.
2. Autorizar consolidación en `proyectos/app/{proyecto}/final/`.

No existe flag YAML de construcción para este gate: el registro en `audits/` es la fuente de verdad.

---

# Resultado

## APROBADO

La solución puede copiarse a `final/` y usarse para demo o publicación.

## REQUIERE CORRECCIONES

Debe construirse una nueva iteración (refinamiento).

## RECHAZADO

La solución no es apta para liberación.

---

# Regla

Ninguna versión puede avanzar a `final/` ni a publicación sin aprobar esta auditoría.
