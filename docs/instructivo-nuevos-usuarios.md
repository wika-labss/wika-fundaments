# Instructivo para Nuevos Usuarios WIKA

Guía práctica para entender **cómo comienza** y **cómo finaliza** el flujo de desarrollo en WIKA.

**Audiencia:** negocio, desarrolladores, diseñadores y agentes IA que participan por primera vez en un proyecto WIKA.

**Fuente de verdad:** rama `wika-fundaments-v2` en el repositorio `wika-fundaments`.

---

## 1. Qué es WIKA en una frase

WIKA es el **sistema operativo de desarrollo** de la empresa: un conjunto de reglas, plantillas, auditorías y agentes IA que transforman **documentación clara** en **aplicaciones funcionales**, con revisión humana del arquitecto en cada etapa crítica.

```text
La documentación define el producto.
La IA genera la solución.
El arquitecto garantiza la calidad.
```

---

## 2. Los tres repositorios que debes conocer

| Repositorio | Para qué sirve | Qué contiene |
|-------------|----------------|--------------|
| **wika-fundaments** | Reglas y plantillas | Templates, auditorías, estándares, workflows |
| **proyectos** | Aplicaciones | Tu app en `app/{nombre}/idea/`, `iterations/`, `final/` |
| **design-system** | Profesionalización visual (V3+) | Tokens, mockups, component kits — solo apps maduras |

**Regla simple:** las reglas viven en `wika-fundaments`; tu producto vive en `proyectos`; el diseño avanzado llega después en `design-system`.

---

## 3. Roles: quién hace qué

Catálogo oficial: [`agents/README.md`](../agents/README.md). No existe un único «Agente IA».

| Rol | Tipo | Responsabilidad |
|-----|------|-----------------|
| **Negocio / Producto** | humano | Problema, prioridad y aceptación de demo |
| **Arquitecto** | humano | Único que aprueba gates y escribe **APROBADO** |
| **wika-bootstrap** | IA | Scaffold `proyectos/app/{proyecto}/` + plantillas |
| **wika-scribe** | IA | Docs `idea/` 01–05 en orden de gates |
| **wika-auditor** | IA | Borradores de auditoría (nunca flags en `true`) |
| **wika-designer** | IA | `04-application-design.md` + wireframe Gate 3A |
| **wika-builder** | IA | Código `iterations/v1/` si `ready_for_construction` |
| **wika-refiner** | IA | `iterations/vN/` desde `idea/` + `review.md` + source previo |
| **wika-packager** | IA | `final/` solo con Release APROBADO |
| **WIKA (plataforma)** | — | Plantillas, estándares y este catálogo |

Ningún agente IA debe avanzar a código de producción sin aprobación del arquitecto en los gates correspondientes. Ningún agente IA activa flags YAML.

---

## 4. Cómo COMIENZA el flujo

### Paso 0 — Tienes una idea

Identificas una necesidad: un juego, una utilidad, una app interna, etc.

### Paso 1 — Crear el proyecto

Crea una carpeta en el repositorio de aplicaciones:

```text
proyectos/
└── app/
    └── mi-proyecto/
        ├── idea/
        ├── audits/
        ├── iterations/
        └── final/
```

Opcional: añade un `readme.txt` con estado del proyecto (como hacen tower, arkanoid, sodoku).

### Paso 2 — Copiar las plantillas oficiales

Desde `wika-fundaments/templates/`, copia los 5 documentos a `idea/`:

```text
proyectos/app/mi-proyecto/idea/
├── 01-problem.md
├── 02-features.md
├── 03-module-discovery.md
├── 04-application-design.md
└── 05-build-plan.md
```

### Paso 3 — Completar documentación (Preparación)

Rellena los documentos **en orden**, usando placeholders `[ ... ]` como guía. Los documentos 03–05 no habilitan la etapa siguiente si el gate anterior está en `false`:

| Orden | Documento | Qué defines |
|-------|-----------|-------------|
| 1 | `01-problem.md` | Problema, usuarios, alcance, restricciones, IDs `ERR-XX` |
| 2 | `02-features.md` | Features `FEAT-XX`, escenarios BDD, NFRs |
| 3 | `03-module-discovery.md` | Módulos `MOD-XX`, contratos, dependencias |
| 4 | `04-application-design.md` | Navegación, wireframes, tokens/theme |
| 5 | `05-build-plan.md` | Cronograma de construcción V1 |

**Trazabilidad obligatoria (RTM):**

```text
ERR-XX  →  FEAT-XX  →  MOD-XX  →  VIEW-XX  →  Paso N del build plan
```

Cada fila debe conectar un dolor (problema) con su solución (feature), su módulo y su implementación.

---

## 5. El flujo completo (de inicio a fin)

```text
┌─────────────────────────────────────────────────────────────────┐
│                        INICIO                                   │
│  Idea → Crear proyecto → Copiar plantillas → Completar idea/    │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  GATE 1 — Auditoría de Documentación                            │
│  Docs: 01-problem + 02-features                                 │
│  Flag: audit_1_passed: true                                     │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Descubrimiento de Módulos (03-module-discovery)                │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  GATE 2 — Auditoría de Módulos                                  │
│  Flag: audit_2_passed: true                                     │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Diseño de Aplicación (04-application-design)                   │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  GATE 3A — Aprobación Visual (arquitecto / stakeholder)         │
│  Flag: visual_approval_passed: true                             │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  GATE 3B — Auditoría de Ensamblado (04 + 05)                    │
│  Flag: audit_3_passed: true                                     │
│  Flag: ready_for_construction: true                             │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Construcción V1 — wika-builder genera código en iterations/v1/ │
│  Verify + APK + review.md                                       │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  GATE 4 — Auditoría de Release V1                               │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Refinamiento — iterations/v2, v3, v3.1...                      │
│  Documentación original + review + iteración anterior           │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  (Opcional V3+) Design System — tokens, component kits, assets  │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FIN                                      │
│  Versión Final → final/ → Demo / Publicación                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Gates: cuándo puedes avanzar

Los gates son **puertas de calidad**. Sin aprobación, no se avanza.

| Gate | Cuándo | Documentos | Flag YAML | Auditoría |
|------|--------|------------|-----------|-----------|
| **1** | Antes de módulos | 01, 02 | `audit_1_passed: true` | `auditoria-documentacion.md` |
| **2** | Antes de diseño | 03 | `audit_2_passed: true` | `auditoria-modulos.md` |
| **3A** | Antes de build plan final | 04 | `visual_approval_passed: true` | Visto bueno arquitecto |
| **3B** | Antes de código | 04, 05 | `audit_3_passed: true` | `auditoria-ensamblado.md` |
| **V1** | Antes de tocar `src/` | 05 | `ready_for_construction: true` | Todos los anteriores |
| **Release** | Antes de `final/` | iterations/v1 | registro en `audits/` | [`auditoria-release-v1.md`](auditoria-release-v1.md) |

**Dónde se registran las auditorías del proyecto:**

```text
proyectos/app/mi-proyecto/audits/
├── auditoria-documentacion.md
├── auditoria-modulos.md
├── auditoria-ensamblado.md
└── auditoria-release-v1.md
```

**Cómo activar un gate:** el arquitecto aprueba la auditoría y cambia el flag en el frontmatter YAML del documento correspondiente.

Ejemplo en `01-problem.md`:

```yaml
audit_1_passed: true  # solo tras aprobación formal
```

---

## 7. Construcción V1 — qué ocurre en la práctica

Cuando `ready_for_construction: true`, **wika-builder** puede generar la primera iteración:

```text
proyectos/app/mi-proyecto/iterations/v1/
├── app/              # Pantallas (expo-router)
├── src/
│   ├── engine/       # Lógica pura
│   ├── modules/      # Capacidades
│   └── constants/    # theme.ts
├── scripts/
│   ├── verify-build.sh
│   └── build-apk.sh
└── package.json
```

**Stack estándar V1:** Expo SDK 52, React Native, TypeScript, Android APK sin Metro.

**Verificación obligatoria antes de cerrar V1:**

```bash
npm run typecheck
npm run verify
```

**Referencia de proyecto limpio:** `proyectos/app/tower/iterations/v1/`

---

## 8. Refinamiento — cuando V1 no es suficiente

Si el arquitecto deja observaciones en `review.md`, **wika-refiner** genera una nueva iteración:

```text
v1 → v2 → v3 → v3.1 → ...
```

Cada refinamiento debe usar:

1. Documentación original en `idea/` (nunca duplicar ni modificar sin proceso)
2. Comentarios de `review.md`
3. Código de la iteración anterior

**Regla de contexto:** nueva generación = `idea/` + revisiones acumuladas + último código.

---

## 9. Design System (V3+) — capa visual avanzada

Cuando la app es **funcionalmente madura** (típicamente V3+), entra el repositorio `design-system`:

```text
Auditor UI → Brief → Mockups → Aprobación → Tokens → Componentes → Assets
```

**No confundir:**

| Nivel | Cuándo | Dónde |
|-------|--------|-------|
| Tokens base V1 | Pre-build / construcción | `standards/design-system.md` + `theme.ts` |
| Profesionalización V3+ | App estable | Repo `design-system/` |

Ejemplo completo: **sodoku nuevo** (V3.2+).

---

## 10. Cómo FINALIZA el flujo

El flujo termina cuando la solución cumple los objetivos definidos en `01-problem.md` y el arquitecto aprueba la versión final.

### Paso final 1 — Auditoría de Release

Se valida que V1 (o la iteración acordada) cumple features, NFRs y criterios BDD.

### Paso final 2 — Versión Final

Se consolida en:

```text
proyectos/app/mi-proyecto/final/
├── source/           # Código aprobado
├── apk/              # Binario de distribución
├── documentation/    # Docs de release
└── release-notes.md  # Notas de versión
```

### Paso final 3 — Demo / Publicación

La versión en `final/` se usa para:

- Demostración a stakeholders
- Distribución interna (APK sideload)
- Publicación en store (si aplica en fases posteriores)

### Criterio de cierre

El proyecto está **cerrado funcionalmente** cuando:

- [ ] Criterios de éxito BDD de `01-problem.md` cumplidos
- [ ] Features obligatorias de `02-features.md` implementadas
- [ ] `auditoria-release-v1.md` en estado **APROBADO**
- [ ] Artefactos en `final/` generados
- [ ] Arquitecto firma release

---

## 11. Checklist rápido para nuevos usuarios

### Al empezar

- [ ] Proyecto creado en `proyectos/app/{nombre}/`
- [ ] 5 plantillas copiadas a `idea/`
- [ ] IDs `ERR-XX`, `FEAT-XX`, `MOD-XX` definidos y trazados
- [ ] Out-of-scope explícito en 01 y 02

### Antes de pedir código a la IA

- [ ] `audit_1_passed: true`
- [ ] `audit_2_passed: true`
- [ ] `visual_approval_passed: true`
- [ ] `audit_3_passed: true`
- [ ] `ready_for_construction: true`

### Al cerrar

- [ ] `npm run verify` exitoso
- [ ] `review.md` aprobado
- [ ] `auditoria-release-v1.md` aprobada
- [ ] `final/` poblado

---

## 12. Errores comunes (evítalos)

| Error | Por qué es problema | Qué hacer |
|-------|---------------------|-----------|
| Pedir código sin completar `idea/` | La IA improvisa | Completar 01–05 primero |
| Saltarse auditorías | Sin control de calidad | Respetar gates en orden |
| Duplicar docs en `iterations/` | Pierde fuente de verdad | Solo editar `idea/` |
| Hardcodear colores en código | Rompe estándares | Usar `theme.ts` / tokens |
| Activar design-system en V1 | Proceso prematuro | UI base en V1; DS en V3+ |
| Usar `^` en dependencias Expo | Builds inestables | Usar `~` (WIKA-ARCH-02) |

---

## 13. Documentos de referencia

| Necesitas... | Lee... |
|--------------|--------|
| Plantillas oficiales | `wika-fundaments/templates/` |
| Reglas de documentación | `wika-fundaments/docs/documentation.md` |
| Auditorías (checklists) | `wika-fundaments/docs/auditoria-*.md` |
| Estándares técnicos | `wika-fundaments/standards/coding-standards.md` |
| Tokens y diseño V1 | `wika-fundaments/standards/design-system.md` |
| Catálogo de agentes | `wika-fundaments/agents/` |
| Gates YAML | `wika-fundaments/.cursorrules` |
| Ciclo de vida completo | `wika-fundaments/workflows/application-lifecycle.md` |
| Proyecto de referencia V1 | `proyectos/app/tower/` |
| Integración design-system | `proyectos/app/sodoku nuevo/` + repo `design-system/` |

---

## 14. Resumen en 30 segundos

1. **Comienzas** creando un proyecto en `proyectos/app/` y completando 5 documentos en `idea/`.
2. **Avanzas** pasando auditorías y activando flags YAML (`audit_1_passed` → `ready_for_construction`).
3. **Construyes** V1 con IA en `iterations/v1/`, verificas con `npm run verify`.
4. **Refinas** en v2, v3… hasta cumplir objetivos.
5. **Finalizas** con auditoría de release y versión en `final/` lista para demo o publicación.
6. **Opcionalmente** profesionalizas visualmente en V3+ vía `design-system/`.

**Si tienes dudas en cualquier gate, consulta al arquitecto antes de avanzar.**
