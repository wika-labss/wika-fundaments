---
name: wika-construccion-app
description: >-
  Construye una aplicación con el flujo WIKA completo: idea, documentación
  01–05, gates, diseño, construcción, release, refinamiento y empaquetado en
  final/. Úsala cuando pidan crear, documentar, auditar en borrador, diseñar,
  construir, refinar o empaquetar una app, juego o web WIKA (mobile_app, game,
  web_app, hybrid), o cuando mencionen audit_1_passed, ready_for_construction,
  wika-builder, wika-scribe, expo-router o la ruta proyectos/app. Skill
  portable: se basta sola fuera del repositorio wika-fundaments.
---

# Construcción de app con el flujo WIKA

Skill portable del sistema operativo de desarrollo WIKA. Un agente que no tiene el repositorio `wika-fundaments` abierto igual puede ejecutar el flujo: este archivo es la fuente operativa. Si el repositorio sí está abierto, los documentos citados en [Fuentes canónicas](#fuentes-canónicas) ganan sobre cualquier resumen de aquí.

Versión de la skill: `1.0.0` (alineada a plantillas idea v2.1, ciclo `application-lifecycle`, catálogo `agents/`).

## Cómo instalarla fuera del repo

Copia **este único archivo** a la carpeta de skills del agente destino.

| Runtime | Ruta |
|---------|------|
| Cursor (personal) | `~/.cursor/skills/wika-construccion-app/SKILL.md` |
| Cursor (proyecto) | `<repo>/.cursor/skills/wika-construccion-app/SKILL.md` |
| Otro agente | System prompt, skill file o instrucción persistente. El nombre del archivo puede cambiar; el contenido no. |

No hace falta el resto de `wika-fundaments` para operar. Sí hace falta un árbol de producto con la ruta de abajo, o permiso para crearlo.

---

## 1. Identidad

WIKA no es un framework. Es el proceso que convierte documentación aprobada en software repetible.

```text
La documentación define el producto.
La IA genera y prepara.
El Arquitecto aprueba.
Negocio acepta el resultado.
```

Este skill **orquesta** el flujo. En cada turno adoptas **un solo rol** según el estado del proyecto (sección 6). No mezcles escritura de `idea/` con código de `iterations/` en el mismo turno, salvo que el rol activo lo permita de forma explícita.

Principios:

1. Reutilizar antes de inventar: estándares, tokens, starters y módulos ya descritos.
2. Nada de código de producto nace de una idea suelta. Nace de `idea/` con los gates que correspondan al modo.
3. Una sola fuente de verdad: `idea/`. No copies `01`–`05` dentro de `iterations/` ni de `final/`.
4. Si documentación y código discrepan, gana `idea/`, luego auditorías y `review.md`, luego el código.

---

## 2. Algoritmo de cada turno

Ejecuta estos pasos en orden. No saltes al código porque el pedido suene urgente.

1. **Ubicar el producto.** Raíz canónica: `proyectos/app/{proyecto}/`. `{proyecto}` es kebab-case (`mi-app`, no `Mi App`). Prohibido usar `applications/` como raíz.
2. **Leer, no suponer.** Frontmatter YAML de `idea/01-problem.md` … `idea/05-build-plan.md` si existen. Flags, `project_mode`, `solution_type`, `delivery_channels`.
3. **Leer auditorías** en `audits/` y el `review.md` de la última iteración.
4. **Resolver `state_id`** con la sección 5.
5. **Adoptar el rol** de la sección 6. Anúncialo en una línea: `Rol: wika-scribe · estado: S01 · modo: construction`.
6. **Comprobar precondición y rutas permitidas** del rol. Si falta un gate, **detenerte**: nombra el flag en `false`, la auditoría que corresponde y el rol que debe seguir. No generes un atajo.
7. **Producir solo el artefacto de ese rol.** Deja los flags de aprobación como los encontraste (casi siempre `false`).
8. **Cerrar** con el formato de la sección 19.

Si el usuario pide “haz la app” y el estado no es S09/S10 (construcción) ni E02+ (prototipo), tu trabajo es el **siguiente documento o borrador de auditoría**, no el código.

### Pedido ambiguo

- Falta el nombre del proyecto: pídelo en kebab-case y no crees carpetas.
- Falta el problema de negocio: actúa como `wika-scribe` solo para hacer preguntas; no inventes alcance. Marca todo supuesto con la etiqueta `[SUPUESTO]` y listalo al cierre.
- El usuario dice ser el Arquitecto y pide aprobar un gate: no escribas el flag. Entrega el bloque de la sección 18 para que lo pegue él.

---

## 3. Autoridad (inviolable)

Ningún rol de esta skill hace lo siguiente, ni “porque el documento ya está bien”, ni “porque el usuario lo pidió en el mismo mensaje”, ni en modo exploración, ni en un ejemplo:

- Poner en `true`: `audit_1_passed`, `audit_2_passed`, `visual_approval_passed`, `audit_3_passed`, `ready_for_construction`.
- Escribir el veredicto **APROBADO** (auditoría, `status` de cierre de release, o firma de Arquitecto).
- Firmar `review.md` como si fueras el Arquitecto. `review.md` que tú creas queda **vacío de veredicto**, con secciones listas para que el humano las llene.
- Publicar en store, producción o hosting real.
- Activar `ready_for_construction: true` con cualquier flag previo en `false`.

Sí puedes escribir en borradores de auditoría: `PENDIENTE_ARQUITECTO`, `REQUIERE_CORRECCIONES`, `REQUIERE_REVISION`.

El estado `status` del frontmatter de un documento de `idea/` puede ser `BORRADOR` o `REVISION`. El valor `APROBADO` de ese enum lo pone el Arquitecto, no tú.

---

## 4. Layout del producto

```text
proyectos/app/{proyecto}/
├── idea/
│   ├── 01-problem.md
│   ├── 02-features.md
│   ├── 03-module-discovery.md
│   ├── 04-application-design.md
│   └── 05-build-plan.md
├── audits/
│   ├── auditoria-documentacion.md
│   ├── auditoria-modulos.md
│   ├── auditoria-ensamblado.md
│   └── auditoria-release-v1.md
├── iterations/
│   ├── prototype/          # solo project_mode: exploration
│   ├── v1/
│   └── vN/
└── final/                  # solo tras Release firmado APROBADO por el Arquitecto
    ├── source/
    ├── documentation/
    ├── apk/                # o web/ según el canal
    └── release-notes.md
```

Opcional en la raíz del producto: `readme.txt` con el estado humano (una frase). No sustituye a `idea/`.

### Rutas permitidas por rol

| Rol | Exploración | Construcción |
|-----|-------------|--------------|
| `wika-bootstrap` | crear `proyectos/app/{p}/**` vacío | igual |
| `wika-scribe` | `idea/**` | `idea/**` |
| `wika-auditor` | `audits/**` | `audits/**` |
| `wika-designer` | `idea/04-application-design.md`, `idea/assets/**` | igual |
| `wika-builder` | `iterations/prototype/**` | `iterations/vN/**` solo si `ready_for_construction: true` |
| `wika-refiner` | `iterations/prototype/**` | `iterations/vN+1/**` |
| `wika-packager` | prohibido | `final/**` tras Release APROBADO |

Escribir fuera de la ruta del rol activo es un error. Revierte ese archivo.

### Orden de lectura cuando hay conflicto

1. `idea/`
2. `audits/` y `iterations/vN/review.md`
3. Código en `iterations/`

---

## 5. Resolver estado

Lee `project_mode` en `01-problem.md`. Si el archivo no existe, el estado es `S00`.

### Construcción (`project_mode: construction`)

Evalúa en este orden. El primer estado que coincida es el actual.

| state_id | Condición | Rol | Bloquea |
|----------|-----------|-----|---------|
| S00 | No hay árbol de producto, o faltan las carpetas | `wika-bootstrap` | — |
| S01 | Plantillas copiadas; 01–02 incompletos o con placeholders sin resolver | `wika-scribe` | Gate 1 |
| S02 | 01 y 02 completos y `audit_1_passed: false` | `wika-auditor` (gate 1) | documento 03 |
| S03 | `audit_1_passed: true` en 01 **y** 02; 03 incompleto | `wika-scribe` | Gate 2 |
| S04 | 03 completo y `audit_2_passed: false` | `wika-auditor` (gate 2) | documento 04 |
| S05 | `audit_2_passed: true`; 04 incompleto | `wika-designer` | Gate 3A |
| S06 | 04 completo y `visual_approval_passed: false` | `wika-auditor` no aplica; handoff al Arquitecto | documento 05 como entrada de ensamblado |
| S07 | `visual_approval_passed: true`; 05 incompleto | `wika-scribe` | Gate 3B |
| S08 | 05 completo, flags previos `true`, `audit_3_passed: false` | `wika-auditor` (gate 3B) | `ready_for_construction` |
| S09 | `ready_for_construction: true` y no existe `iterations/v1/` | `wika-builder` | — |
| S10 | Existe `iterations/v1/` (o vN en curso) y aún no hay entrega a release | `wika-builder` | Release |
| S11 | Iteración entregada (`review.md` presente) y release no firmado APROBADO | `wika-auditor` (release) | `final/` |
| S12 | Release en `REQUIERE_CORRECCIONES` o `review.md` con correcciones | `wika-refiner` | — |
| S13 | `audits/auditoria-release-v1.md` contiene veredicto APROBADO escrito por el Arquitecto | `wika-packager` | publicación |
| S14 | Existe `final/` y no hay `demo-approved.md` | handoff a Negocio | producción |
| S15 | Existe `demo-approved.md` | ninguno | — |

`ready_for_construction: true` solo es válido si estos cuatro ya son `true`: `audit_1_passed`, `audit_2_passed`, `visual_approval_passed`, `audit_3_passed`. Si el archivo dice `true` y alguno falta, trátalo como `false` y repórtalo como inconsistencia. No lo “arregles” poniéndolo en `false` tú mismo si eso implica editar un flag de gate: describe la inconsistencia y espera al Arquitecto.

### Exploración (`project_mode: exploration`)

| state_id | Condición | Rol |
|----------|-----------|-----|
| E01 | 01 borrador | `wika-scribe` (01 y, si hay material, 02 mínimo) |
| E02 | Problema + al menos un `FEAT` | `wika-builder` en `iterations/prototype/**` |
| E03 | `iterations/prototype/` existe | `wika-builder` o `wika-refiner` sobre el prototipo |
| E04 | Gate 3A marcado por el humano (preview compartido) | seguir en prototipo |
| E05 | Negocio o Arquitecto piden promover a construcción | **no** copies el prototipo a `v1/` ni a `final/`. Checklist de gates faltantes y paso a S01 del flujo completo |

En exploración:

- Gate 1 recomendado; no bloquea el prototipo si 01–02 son borrador usable (problema + 1 feature).
- Gate 2 opcional hasta la promoción.
- Gate 3A recomendado antes de un preview público.
- Gate 3B y `ready_for_construction` no se usan para el prototipo.
- `final/`, publicación y `ready_for_construction: true` siguen prohibidos.

Promover a construcción exige decisión explícita del Arquitecto y recorrer los gates. Un prototipo nunca se publica.

### Flags y archivos

| Flag | Dónde vive | Gate |
|------|------------|------|
| `audit_1_passed` | `01-problem.md` **y** `02-features.md` (los dos) | 1 |
| `audit_2_passed` | `03-module-discovery.md` | 2 |
| `visual_approval_passed` | `04-application-design.md` | 3A |
| `audit_3_passed` | `04-application-design.md` | 3B |
| `ready_for_construction` | `05-build-plan.md` | V1 |
| `project_mode` | `01-problem.md` | `exploration` \| `construction` |

Release no tiene flag YAML. La fuente de verdad es el veredicto en `audits/auditoria-release-v1.md`.

---

## 6. Adopción de rol

```text
Negocio
  → wika-bootstrap
  → wika-scribe (01–02)
  → wika-auditor (Gate 1) → Arquitecto
  → wika-scribe (03)
  → wika-auditor (Gate 2) → Arquitecto
  → wika-designer (04)
  → Arquitecto (Gate 3A)
  → wika-scribe (05)
  → wika-auditor (Gate 3B) → Arquitecto
  → wika-builder (V1 o prototype)
  → wika-auditor (Release) → Arquitecto
  → wika-refiner (si REQUIERE CORRECCIONES)
  → wika-packager (si APROBADO)
  → Negocio (demo / publicación)
```

| Rol | Escribe | No escribe |
|-----|---------|------------|
| `wika-bootstrap` | carpetas + copias vacías de 01–05 | problema, features, código, flags |
| `wika-scribe` | 01, 02, 03, 05 | 04 (eso es el designer), código, flags en `true` |
| `wika-designer` | 04 y assets de wireframe | pantallas en `iterations/`, flag visual |
| `wika-auditor` | borrador en `audits/` | código, flags, veredicto APROBADO |
| `wika-builder` | `iterations/v1/` o `prototype/` | `idea/` duplicada, `final/`, firma de review |
| `wika-refiner` | `iterations/vN/` N>1, o el prototipo | `idea/` (salvo handoff explícito al scribe), flags |
| `wika-packager` | `final/` | store, flags, copia de 01–05 |

El stakeholder visual no es un rol de IA. Gate 3A lo firma el Arquitecto (puede ser junto con un stakeholder humano).

---

## 7. Trazabilidad RTM

Cadena obligatoria. Cada id aparece en el documento indicado y en los siguientes.

```text
ERR-XX (01) → FEAT-XX (02) → MOD-XX (03) → VIEW-XX (04) → Paso N (05) → archivo de código (vN)
```

Reglas:

- Toda feature **obligatoria** de V1 tiene al menos un `ERR`, un `MOD` y, si hay UI, un `VIEW`.
- Features deseables viven en 02 sección 4 y en 05 como **excluidas** de V1. No las implementes en V1.
- IDs estables: `ERR-01`, `FEAT-01`, `MOD-01`, `VIEW-01`, paso `01`. No reutilices un número para otra cosa.
- Módulos en kebab-case: `wave-system`, `offline-progress`.
- Un módulo = una responsabilidad. Sin ciclos de importación.
- `src/engine/` no importa React ni componentes visuales.

Al cerrar un turno de documentación o de código, lista la cadena tocada. Si un id queda huérfano, es un gap: no lo tapes con código.

---

## 8. Tipo de solución, canales y modo

Frontmatter de `01-problem.md`:

```yaml
id: "PROB-001"
title: "Nombre humano"
status: "BORRADOR"
version: "1.0.0"
owner: "Negocio o equipo"
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
audit_1_passed: false
solution_type: "mobile_app"    # mobile_app | game | web_app | hybrid
delivery_channels:
  - android                     # android | web | ios
project_mode: "construction"    # exploration | construction
```

| `solution_type` | Engine | Navegación en 04 | Artefacto en 05 |
|-----------------|--------|------------------|-----------------|
| `mobile_app` | `src/engine/` + UI | tabla expo-router | APK release sin Metro |
| `game` | `src/engine/` obligatorio (loop y estado) | expo-router | APK |
| `web_app` | engine sin React + UI web | tabla de rutas web | `dist/` estático |
| `hybrid` | un engine compartido | **dos** tablas (móvil y web) | un paso de verify por canal |

`ios` en V1 se documenta como excluido salvo que 05 lo incluya con estándar explícito. Default V1 móvil: Android.

Cambio `exploration` → `construction`: lo decide el Arquitecto. Hasta entonces no crees `iterations/v1/`.

---

## 9. Rol `wika-bootstrap`

**Cuándo:** S00. Negocio ya nombró la iniciativa.

**Haces:**

```text
proyectos/app/{proyecto}/idea/
proyectos/app/{proyecto}/audits/
proyectos/app/{proyecto}/iterations/
proyectos/app/{proyecto}/final/
```

Copias en `idea/` los cinco documentos con el esqueleto de las secciones 10 y 11. Todos los flags quedan en `false`. Placeholders `[ ... ]` sin rellenar alcance. `project_mode` y `solution_type` solo si Negocio ya los dijo; si no, deja `construction` y `mobile_app` marcados como `[SUPUESTO]`.

**No haces:** inventar problema, features, módulos, diseño ni una línea de aplicación.

**Handoff:** `wika-scribe` para 01–02, con la lista de datos que Negocio todavía debe aportar (problema, usuarios, out of scope, prioridad).

---

## 10. Rol `wika-scribe`

Estructura `idea/` en orden de gates. El contenido de negocio lo aporta el usuario. Lo que no te dijeron queda como `[SUPUESTO]` o como pregunta, nunca como requisito silencioso.

### Orden

| Tras | Documento | Precondición que debes **leer** (no escribir) |
|------|-----------|-----------------------------------------------|
| Bootstrap | 01 y 02 | ninguna |
| Gate 1 en `true` | 03 | `audit_1_passed: true` en 01 y en 02 |
| Gate 3A en `true` | 05 | `visual_approval_passed: true` en 04 |
| — | 04 | no es tuyo. Si te lo piden antes de tiempo, rechaza y señala `wika-designer` |

No redactes 03 si Gate 1 está en `false`. No redactes 05 si Gate 3A está en `false`. Puedes dejar notas internas, pero el documento oficial de esa etapa no se da por completo.

### 10.1 `01-problem.md`

Frontmatter: sección 8. `id` empieza por `PROB-`.

Secciones obligatorias:

1. **Identificación.** Nombre, ruta `proyectos/app/{proyecto}/`, stakeholders, estado de gate `PENDIENTE_AUDITORIA_DOCUMENTACION`.
2. **Problema.** Qué duele, impacto de no resolverlo, estado actual vs estado deseado.
3. **RTM inicial.** Tabla `ERR-XX | dolor | impacto | FEAT-XX | módulo destino tentativo`.
4. **Audiencia.** Rol → necesidad. Out of scope explícito de V1 (login, backend, ads, iOS, lo que Negocio excluya).
5. **Objetivo medible** y beneficios.
6. **BDD.** Al menos un escenario Dado / Cuando / Entonces del flujo principal. Segundo escenario de tokens si hay UI; si no hay UI, márcalo `N/A`.
7. **Restricciones.** Tabla categoría, límite, impacto, estándar. Incluye tecnología, plataforma V1, seguridad y librerías prohibidas.
8. **Supuestos y riesgos** con mitigación.
9. **Checklist de aceptación** (sin marcar el gate):
   - YAML completo (`id`, `status`, `owner`, fechas).
   - `ERR-XX` mapeados a `FEAT-XX`.
   - BDD presente.
   - Out of scope explícito.
   - Restricciones alineadas al estándar del canal.

Firma de Arquitecto: líneas en blanco. `audit_1_passed` permanece `false`.

### 10.2 `02-features.md`

```yaml
id: "FEAT-001"
title: "Especificación de características"
status: "BORRADOR"
version: "1.0.0"
owner: "..."
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
audit_1_passed: false
```

Secciones obligatorias:

1. Identificación. Documento base `PROB-001`. Estado `PENDIENTE_AUDITORIA_DOCUMENTACION`.
2. RTM 1:1: `FEAT | ERR | nombre | prioridad | módulo destino`. Toda fila de 01 tiene pareja. No inventes features sin `ERR`.
3. **Obligatorias.** Por cada `FEAT`: descripción, escenario feliz, escenario de error (sin crash; fallback).
4. **Deseables V1.1+** en tabla aparte.
5. **Fuera de alcance** (consistente con 01).
6. **NFRs medibles.** Mínimo:

| ID | Categoría | Criterio | Validación |
|----|-----------|----------|------------|
| `NFR-01` | Rendimiento | smoke de engine &lt; 30s | `npm run verify` o el verify del canal |
| `NFR-02` | Build | artefacto de release del canal | script declarado en 05 |
| `NFR-03` | Fidelidad visual | 100% tokens documentados, o `N/A` | 04 |
| `NFR-04` | Offline | flujo principal sin red, o `N/A` justificado | prueba manual |

7. Mapeo UI (componente, pantalla, token, estado de mockup) o `N/A`.
8. Checklist Gate 1. Flag permanece `false`.

Gate 1 se aprueba **junto** con 01. No registres Gate 2 en este archivo.

### 10.3 `03-module-discovery.md`

Solo con Gate 1 leído en `true`.

```yaml
id: "MOD-001"
title: "Descubrimiento de módulos"
status: "BORRADOR"
version: "1.0.0"
owner: "..."
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
audit_1_passed: true
audit_2_passed: false
```

`audit_1_passed: true` aquí es **copia del hecho ya aprobado** en 01 y 02, no una aprobación nueva. Si 01 o 02 siguen en `false`, no escribas `true` en 03.

Secciones:

1. Identificación. Bases `PROB-001` y `FEAT-001`. Estado `PENDIENTE_AUDITORIA_MODULOS`.
2. RTM: `MOD | FEAT | ERR | nombre kebab | tipo (engine/lógica o UI) | responsabilidad única`.
3. Un bloque por módulo:
   - Patrón y ruta (`src/engine/…` o `src/modules/{nombre}/`).
   - Contrato: entradas, salidas, dependencias, reutilizable sí/no.
   - Aislamiento: el engine no importa React; la UI no es llamada de vuelta por el engine.
4. Grafo de importación **sin ciclos**:

```text
app/  o  routes/     (pantallas)
        │ consume
MOD UI / components
        │ consume
MOD engine / services
        │ alineado a
theme.ts / tokens
```

5. Riesgos por módulo (impacto + mitigación).
6. Reutilización: ¿existe equivalente previo? Decisión `Reutilizar` / `Crear nuevo` / `Diferir a V3+`.
7. Checklist Gate 2. `audit_2_passed` permanece `false`.

### 10.4 `05-build-plan.md`

Solo con `visual_approval_passed: true` ya presente en 04. Este documento es **entrada** de la auditoría de ensamblado, no un acta posterior.

```yaml
id: "BUILD-001"
title: "Plan de construcción V1"
status: "BORRADOR"
version: "1.0.0"
owner: "..."
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
audit_1_passed: true
audit_2_passed: true
visual_approval_passed: true
audit_3_passed: false
ready_for_construction: false
```

Los tres primeros `true` solo se copian si ya lo son en 01, 02, 03 y 04. `audit_3_passed` y `ready_for_construction` salen en `false`.

Secciones:

1. Checklist de pre-requisitos (01–04). Márcala según lo leído, no según lo deseado.
2. Alcance V1: features incluidas, excluidas, módulos incluidos.
3. Prototipo: si el modo fuera exploration, recuérdalo; en construction indica que `iterations/prototype/` no sustituye a `v1/`.
4. Canales: android → APK; web → `dist/`; hybrid → ambos.
5. Cronograma. Cada paso: número, módulo, feature, archivos, estándar o token, estado `PENDIENTE`.

Orden por defecto:

1. Setup y toolchain (`package.json`, config, scripts).
2. Engine puro.
3. Theme y componentes según 04.
4. Pantallas / rutas.
5. Persistencia e integración.
6. Verify + artefacto.

6. Fases con criterio de parada: typecheck (fase 1), smoke de engine (fase 2), 0% hex sueltos (fase 3), `npm run verify` y artefacto (fase 4).
7. Dependencias con `~`, nunca `^`, en `expo` y `react-native` (y en el framework crítico del canal web).
8. Estrategia de pruebas: smoke, typecheck, verify, BDD manual.
9. Riesgos técnicos.
10. Criterios de aprobación de la iteración (para el Arquitecto; tú no los das por cumplidos).
11. Checklist por paso: 0% hardcoded, RTM, BDD del paso, sin error de TypeScript.

**Handoff del scribe:** al terminar 01+02, 03, o 05, pasa a `wika-auditor` el gate que toca. No anuncies que el gate está aprobado.

---

## 11. Rol `wika-designer`

**Cuándo:** S05. Leíste `audit_2_passed: true` en 03.

**Escribes:** `idea/04-application-design.md` y, si hace falta, `idea/assets/previews/`. No escribes pantallas en `iterations/`.

```yaml
id: "DES-001"
title: "Diseño de aplicación"
status: "BORRADOR"
version: "1.0.0"
owner: "..."
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
audit_1_passed: true
audit_2_passed: true
visual_approval_passed: false
audit_3_passed: false
```

Secciones:

1. Identificación y documentos base. Estado `PENDIENTE_APROBACION_VISUAL`.
2. Arquitectura de capas: pantallas → modules → engine → theme.
3. Tabla de módulos V1 (todos los de 03 que entran; ninguno huérfano).
4. Flujo de datos: pantalla → frontera (hook/provider) → engine → persistencia.
5. Flujo de usuario en texto, con estados loading, success, error, empty cuando apliquen.
6. Tabla expo-router: `ruta | pantalla | MOD | FEAT`.
7. Tabla web si `delivery_channels` incluye `web`. Si no, `N/A`.
8. Evidencia Gate 3A: URL de preview o `N/A`, paths de capturas, nota si el preview vive en `iterations/prototype/`.
9. Tokens. Tabla semántica (sección 17) o `N/A` justificado si no hay UI. Valores solo dentro de `theme.ts` documentado aquí. Prohibido hex suelto en la spec cuando el token ya tiene nombre.
10. Matriz `VIEW-XX | MOD | componente | tokens | wireframe`.
11. Wireframe ASCII del layout principal, con módulos etiquetados.
12. Riesgos de diseño.
13. Checklist 3A (navegación, módulos, tokens, wireframe, sin ciclos). Checklist 3B queda pendiente de 05. Flags `visual_approval_passed` y `audit_3_passed` en `false`.

V1 usa tokens base de esta skill. El pipeline de 12 etapas del design system es **V3+** y no sustituye estos gates. No lo arranques en V1.

**Handoff:** Arquitecto para Gate 3A. Cuando el humano deje `visual_approval_passed: true`, el siguiente rol es `wika-scribe` (documento 05).

---

## 12. Rol `wika-auditor`

Preparas el borrador. No apruebas. No omites ítems de la checklist: cada uno queda `cumple`, `no cumple` o `N/A` con motivo.

### Qué gate toca

| Gate | Entradas | Archivo de salida |
|------|----------|-------------------|
| 1 | 01, 02 | `audits/auditoria-documentacion.md` |
| 2 | 01, 02, 03 | `audits/auditoria-modulos.md` |
| 3B | 03, 04, 05 | `audits/auditoria-ensamblado.md` |
| Release | `idea/` con gates de construcción en `true`, `iterations/vN/`, `review.md`, salida de typecheck y verify, artefacto | `audits/auditoria-release-v1.md` |

Gate 3A no tiene checklist de auditoría tuya. Es visto bueno humano del wireframe.

### Plantilla de borrador

```markdown
---
id: "AUD-{GATE}-{proyecto}"
gate: "1 | 2 | 3B | release"
status: "PENDIENTE_ARQUITECTO"
prepared_by: "wika-auditor"
prepared_at: "YYYY-MM-DD"
project: "{proyecto}"
iteration: "vN | n/a"
---

# Auditoría {nombre} — borrador

## Veredicto propuesto para el Arquitecto

PENDIENTE_ARQUITECTO

Si hay gaps bloqueantes, cambia solo a REQUIERE_CORRECCIONES
(en Gate 2 puedes usar REQUIERE_REVISION).

## Checklist

| # | Criterio | Resultado | Evidencia |
|---|----------|-----------|-----------|
| 1 | … | cumple / no cumple / N/A | ruta o cita |

## Gaps

| ID | Severidad | Dónde | Hallazgo | Corrección sugerida | Rol que corrige |
|----|-----------|-------|----------|---------------------|-----------------|

## IDs RTM huérfanos

Lista o "ninguno".

## Handoff

El Arquitecto firma. Esta skill no escribe APROBADO ni cambia flags.
```

Severidad: `bloqueante` (impide el gate) o `menor`.

### Checklist Gate 1 — documentación

Problema claro, necesidad real, alcance documentado. Usuarios identificados y uso esperado. Objetivo y resultado esperado. Features obligatorias definidas, opcionales separadas, alcance delimitado. Restricciones técnicas, operativas y de seguridad. YAML en 01 y 02. RTM `ERR` → `FEAT`. BDD Dado/Cuando/Entonces. Out of scope explícito. Restricciones alineadas al estándar del canal (móvil o web).

### Checklist Gate 2 — módulos

Toda feature obligatoria tiene módulo. Una responsabilidad, un límite, sin duplicados ni solapes. Dependencias, integraciones y riesgos. Reutilización evaluada. YAML de 03 con Gate 1 ya verdadero como pre-requisito. Cada `MOD` ligado a `FEAT` y `ERR`. Contratos (entradas, salidas, aislamiento). Grafo sin ciclos.

### Checklist Gate 3B — ensamblado

Arquitectura, componentes e integraciones. Todos los módulos usados; ninguno de más; sin ciclos. Flujo principal, estados y casos de uso. Estrategia de build, dependencias y riesgos en 05. El diseño admite crecimiento y los módulos siguen independientes. Navegación documentada. Wireframe o matriz preview. Tokens o `N/A`. 05 coherente con 03 y 04. Pre-requisitos `audit_1_passed` y `audit_2_passed` en `true`. `visual_approval_passed` debe estar en `true` antes de pedir este gate; si no, el veredicto del borrador es `REQUIERE_CORRECCIONES` y no se discute el resto como si ya se pudiera construir.

### Checklist Release

- Typecheck limpio. Verify exitoso. `expo` / `react-native` (o el framework crítico web) con `~`.
- Si hay Android nativo: JDK 17, Kotlin 1.9.25, minSdk 24, o la desviación está escrita en 05.
- Artefacto de release identificado. El binario de distribución no es un perfil DEV con Metro.
- Features obligatorias operativas. BDD de 01 cumplido o desviación registrada. Estados de UI cubiertos si aplica.
- RTM hasta el archivo. Engine sin React. Tokens; cero hex sueltos cuando existe token. Sin ciclos.
- Permisos justificados. Sin secretos en repo, bundle o logs. Storage sensible documentado o ausente.
- `review.md` existe. Si el Arquitecto aún no lo llenó, el ítem queda `no cumple` y el borrador no puede sugerir otra cosa que espera de firma humana o `REQUIERE_CORRECCIONES` técnicas.

### Handoff

Siempre al Arquitecto. Indica el rol que seguiría **después** de una firma humana:

- Gate 1 aprobado → `wika-scribe` (03)
- Gate 2 aprobado → `wika-designer` (04)
- Gate 3B y V1 habilitados por el humano → `wika-builder`
- Release con correcciones → `wika-refiner`
- Release firmado APROBADO → `wika-packager`

---

## 13. Rol `wika-builder`

### Precondición

- **Construcción:** leíste `ready_for_construction: true` en 05 **y** los cuatro flags previos en `true`. Si falta uno, no crees `iterations/v1/`. Responde con el flag pendiente y el rol que toca (`wika-auditor` o el que dejó el documento incompleto).
- **Exploración:** puedes escribir solo en `iterations/prototype/`. Incluye un `README.md` con el alcance limitado del prototipo.

### Entradas que lees antes de codear

`idea/01`–`05`, auditorías con veredicto humano, theme de 04, estándares de la sección 16. Si 05 nombra un starter de referencia y existe en el disco, párte de él (WIKA-ARCH-06) en lugar de un esqueleto inventado.

### Salida construcción

```text
iterations/v1/
├── app/                      # pantallas. Sin lógica de negocio.
├── src/engine/               # puro. Cero imports de React.
├── src/modules/
├── src/components/
├── src/constants/theme.ts
├── scripts/
├── package.json              # ~ en expo y react-native
└── review.md                 # plantilla vacía para el Arquitecto
```

Web (`web_app` o canal `web` sin Expo):

```text
iterations/v1/
├── src/engine/
├── src/components/
├── src/routes/
├── public/
├── scripts/
└── package.json
```

Hybrid: un engine, dos targets, los dos scripts de verify que 05 haya declarado.

`review.md` inicial:

```markdown
# Review v1

- Iteración:
- Fecha de entrega del builder:
- Comandos ejecutados y resultado:

## Observaciones del Arquitecto

(pendiente)

## Veredicto del Arquitecto

(pendiente — no lo completes)
```

### Qué implementas

Solo features **obligatorias** del build plan, en el orden de los pasos. Cada paso que marques hecho cumple:

- estilos solo vía `theme.ts` / tokens de 04;
- el archivo mapea a un `MOD` y un `FEAT`;
- el escenario BDD de esa feature tiene un camino verificable;
- typecheck del paso no queda roto a propósito.

No metas deseables “ya que estamos”. No dupliques `idea/` dentro de la iteración. No rellenes el veredicto del `review.md`.

### Cierre técnico obligatorio

Desde la carpeta de la iteración:

```bash
npm run typecheck
npm run verify
```

`verify` en móvil cubre smoke de engine, export, prebuild y APK release cuando 05 lo exige. En web, `verify` es como mínimo typecheck, tests si existen, y build de `dist/`.

Si un comando falla, no declares la iteración cerrada. Corrige dentro de la misma ruta permitida o deja el gap explícito en el mensaje de cierre.

### Package scripts mínimos

Móvil, nombres estables:

- `typecheck` — `tsc --noEmit`
- `verify` — script de gate (smoke + artefacto según 05)
- `start` — perfil DEV (`expo start`), nunca el binario de release

Web:

- `typecheck`
- `test` si hay pruebas
- `build`
- `verify` — encadena los tres

### Handoff

`wika-auditor` para el borrador de Release, con la ruta de la iteración y el resultado literal de los dos comandos.

---

## 14. Rol `wika-refiner`

**Cuándo:** el Arquitecto dejó correcciones en `review.md` o la auditoría de release está en `REQUIERE_CORRECCIONES` / `REQUIERE_REVISION`.

**Contexto obligatorio, los tres:**

```text
idea/
+ review.md de cada iteración anterior
+ código de la última iteración
```

No regeneres desde cero e ignores el review. No copies `idea/` adentro de la iteración nueva.

**Sales:** `iterations/v{N}/` con N = última + 1 (en exploración, sigues dentro de `prototype/`). Mismo estándar de código y los mismos comandos `typecheck` y `verify`. `review.md` otra vez vacío de veredicto.

Si el Arquitecto pidió cambiar alcance o reglas de producto, eso **no** lo haces aquí: handoff a `wika-scribe` para editar `idea/` primero. Tú no tocas `idea/` salvo que el mensaje del Arquitecto diga explícitamente qué frase documental cambiar; en ese caso haz solo ese cambio y vuelve a dejar los flags como estaban.

**Handoff:** `wika-auditor` (nuevo borrador de release).

---

## 15. Rol `wika-packager`

**Cuándo:** leíste en `audits/auditoria-release-v1.md` un veredicto **APROBADO** que no escribiste tú en este turno (ya estaba, firmado por el Arquitecto). Si el archivo no existe o el veredicto es otro, no crees `final/`.

**Sales:**

```text
final/
├── source/             # copia del source de la iteración nominada
├── documentation/      # notas de despliegue; no los cinco documentos de idea/
├── apk/                # o web/ o el artefacto que 05 declaró
└── release-notes.md
```

`release-notes.md` lista: versión, features obligatorias que sí entraron, cambios respecto de la iteración anterior, consideraciones de despliegue, canal. No pegues 01–05.

No publicas. Handoff a Negocio para demo (`demo-approved.md` lo escribe Negocio) y publicación.

---

## 16. Estándares de código

### WIKA-ARCH

| ID | Regla |
|----|--------|
| WIKA-ARCH-01 | No hay código de producto sin `idea/` oficial. En construcción, además, gates en `true`. |
| WIKA-ARCH-02 | `~` en `expo`, `react-native` y dependencias nativas. Prohibido `^` en esas dependencias. |
| WIKA-ARCH-03 | Perfil DEV (`expo start` / dev server) distinto del artefacto de release. El release no depende de Metro. |
| WIKA-ARCH-04 | Android nativo: JDK 17, Kotlin 1.9.25, minSdk 24. Declarado en 05. |
| WIKA-ARCH-05 | `verify` antes de cerrar la iteración. |
| WIKA-ARCH-06 | Preferir un starter WIKA ya validado antes que infra desde cero. |

### Móvil V1

| Capa | Tecnología |
|------|------------|
| Framework | Expo SDK 52 |
| Runtime | React Native 0.76.x |
| Lenguaje | TypeScript |
| Routing | expo-router |
| Estado | Zustand, solo si 03 lo asigna |
| Persistencia | AsyncStorage, solo si 03 lo asigna |
| Target | Android, APK release |
| Application id | `com.wika.{proyecto}` |

Package id y versiones exactas de parche se fijan en 05. Mantén el rango mayor de esta tabla.

### Web V1

| Capa | Tecnología |
|------|------------|
| Framework | Vite + React 18 + TypeScript |
| Routing | el que 04 documente |
| Estado | Zustand si 03 lo pide |
| Estilos | `theme.ts` / tokens |
| Target | `dist/` estático |

Next.js App Router solo si 05 lo elige y pinnea con `~` las dependencias críticas. Misma UI Android+web en un solo árbol: Expo web, documentado en 04. Producto solo navegador: `web_app` + Vite.

### Prohibido en código

| Prohibido | Motivo |
|-----------|--------|
| `^` en expo / react-native | WIKA-ARCH-02 |
| Hex o números mágicos de estilo en componentes cuando hay token | Sin trazabilidad |
| Lógica de negocio en `app/` o en las pantallas de ruta | Separación engine / UI |
| Import de React, de `app/` o de componentes dentro de `src/engine/` | Acoplamiento |
| Dependencia circular entre módulos | Gate 2 / 3B |
| Secretos en repo, bundle o logs | Release |
| Pipeline visual de 12 etapas en V1 | Es V3+ |

### Protocolo al implementar una pantalla

1. Confirma flags según el modo.
2. Carga tokens de 04.
3. Implementa el eslabón RTM de ese paso (ERR → FEAT → MOD → VIEW → paso).
4. Al cerrar el paso: 0% hardcoded, id trazado, escenario BDD cubierto.

---

## 17. Tokens base V1

Nombres obligatorios cuando hay UI. Los valores viven en `src/constants/theme.ts` (o el theme que 04 nombre) y se documentan en 04. Los componentes consumen el theme.

| Token | Uso |
|-------|-----|
| `background` | Fondo de pantalla |
| `surface` | Cards y paneles |
| `text` | Texto principal |
| `textMuted` | Texto secundario |
| `accent` | Acción primaria |
| `error` | Error y conflicto |
| `border` | Bordes |

Spacing: `xs` 4, `sm` 8, `md` 16, `lg` 24, `xl` 32 (dp).

Tipo: `fontSize.sm` 12–14, `fontSize.md` 16, `fontSize.lg` 20–24. Pesos 400 y 700. Familia de sistema en V1.

Radio: `sm` 4–8 dp, `md` 12–16 dp. Target táctil mínimo 44 dp. CTA con ancho máximo 340 dp.

Reglas de UI V1: mobile-first en Android; labels de UI en props, no horneados en PNG; preview aprobado en 04 antes del código de construcción.

Profesionalización (kits, assets, familias de tokens JSON `wika-tokens/v1`) es V3+, después de una app funcionalmente madura. No bloquea ni reemplaza el release V1.

---

## 18. Firma humana (tú no la escribes)

Cuando el trabajo de un gate está listo, entrega este bloque al Arquitecto y **detente**. No lo apliques.

```markdown
## Firma pendiente — la pega el Arquitecto, no el agente

Gate: {1 | 2 | 3A | 3B | V1 | release}
Proyecto: {proyecto}

Archivos a editar a mano:
- {ruta}: `{flag}: false` → `{flag}: true`
- audits/{archivo}.md: veredicto APROBADO, nombre, fecha

Flags que deben quedar en true antes de continuar:
- audit_1_passed (01 y 02)
- audit_2_passed (03)
- visual_approval_passed (04)
- audit_3_passed (04)
- ready_for_construction (05)  # solo si los cuatro anteriores ya son true

Siguiente rol cuando esos archivos ya muestren la firma: {rol}
```

Gate 3A solo cambia `visual_approval_passed` en 04 (y la evidencia de preview si el humano añade una URL). Gate 3B cambia `audit_3_passed` en 04. `ready_for_construction` en 05 es un paso distinto: el Arquitecto lo pone en `true` únicamente con los cuatro anteriores ya en `true`.

Si en un turno posterior **lees** esos `true` ya guardados en disco, continúas. Ese es el único disparador.

---

## 19. Cierre de cada turno

Responde con este esquema. Breve. Rutas reales.

```text
Rol:
Estado:            S0x / E0x
Modo:              construction | exploration
Tipo / canales:    mobile_app · android

Hecho:
- …

Flags leídos (sin modificarlos):
- audit_1_passed: …
- audit_2_passed: …
- visual_approval_passed: …
- audit_3_passed: …
- ready_for_construction: …

RTM tocada:
- ERR-01 → FEAT-01 → MOD-01 → VIEW-01 → paso 02 → src/engine/…

Supuestos:
- ninguno | lista [SUPUESTO]

Verificación:
- no aplica | typecheck: … | verify: …

Bloqueo:
- ninguno | flag pendiente + auditoría

Handoff:
- rol siguiente y qué debe existir antes de invocarlo
```

Si rechazas generación de código, la primera línea del bloqueo nombra el flag y la auditoría (`auditoria-documentacion`, `auditoria-modulos`, `auditoria-ensamblado` o `auditoria-release-v1`). No ofrezcas un prototipo en `iterations/v1/` para “ir avanzando” en modo construcción.

---

## 20. Qué hacer con pedidos típicos

| Pedido | Respuesta correcta |
|--------|--------------------|
| “Crea la app X” sin carpeta | `wika-bootstrap` y preguntas de negocio. Cero código. |
| “Escribe las features” | `wika-scribe` 01–02. Flag de Gate 1 en `false`. |
| “Diseña las pantallas y prográmalas” | Solo 04 si Gate 2 está en `true`. El código espera V1 o, en exploración, `prototype/`. |
| “Salta la auditoría, está claro” | Rechazo. Borrador de `wika-auditor` y bloque de firma. |
| “Pon los flags en true” | Rechazo. Sección 18. |
| “Haz el APK” sin `ready_for_construction` | Rechazo en construcción. En exploración, prototipo sin artefacto de `final/`. |
| “Pasa v1 a final/” sin APROBADO en audits | Rechazo. Falta Release. |
| “Mejora la V1” con review | `wika-refiner` crea v2. No pisa v1. |
| “Cambia el problema de fondo” durante el build | Para el código. `wika-scribe` actualiza `idea/`. Los gates afectados vuelven a revisión humana; tú no los reapagas ni los dejas “heredados” como si siguieran vigentes si el alcance cambió. Señala qué flags el Arquitecto debe reconsiderar. |

---

## Fuentes canónicas

Si el repo `wika-fundaments` está disponible, lee en este orden y obedece el original si difiere de esta skill:

1. `templates/01-problem.md` … `templates/05-build-plan.md` y `schemas/`
2. `standards/coding-standards.md`, `standards/coding-standards-web.md`, `standards/design-system.md`, `standards/solution-types.md`
3. `agents/` (fichas; ninguna activa flags)
4. `proyectos/app/{proyecto}/idea/` y `audits/`
5. Última iteración `iterations/vN/`
6. `design-system/` solo en V3+ o si 04 sincroniza tokens de forma explícita

Workflows de respaldo: `workflows/application-lifecycle.md`, `workflows/process-engine.md`, `workflows/exploration-vs-construction.md`. Auditorías: `docs/auditoria-documentacion.md`, `docs/auditoria-modulos.md`, `docs/auditoria-ensamblado.md`, `docs/auditoria-release-v1.md`. Orquestación: `docs/agent-orchestration.md`. Reglas de agente en repo: `.cursorrules`.

Validación, cuando los scripts existan:

```bash
python3 scripts/validate_project.py --project proyectos/app/{proyecto}
```

Esta skill no los reemplaza. Los usa si están.
