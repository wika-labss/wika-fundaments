# Application Lifecycle

## Objetivo

Definir el ciclo de vida oficial de una aplicación dentro del ecosistema WIKA.

Este workflow establece cómo una idea se transforma en una solución funcional mediante documentación estructurada, auditorías arquitectónicas y agentes de inteligencia artificial.

Todo proyecto desarrollado bajo WIKA debe seguir este proceso.

La fuente de gates YAML es `.cursorrules`. Las plantillas oficiales viven en `templates/`. Las auditorías oficiales viven en `docs/`.

---

# Filosofía

WIKA se basa en estos principios:

- La documentación define el producto.
- Los quality gates (YAML) impiden generar código sin aprobación.
- La inteligencia artificial genera la solución.
- El arquitecto garantiza la calidad.
- Todo el flujo debe poder repetirse.

Ninguna aplicación debe desarrollarse fuera de este flujo.

---

# Ciclo de Vida

```text
Idea
↓
Preparación (01–02)
↓
Auditoría de Documentación          → audit_1_passed
↓
Descubrimiento de Módulos (03)
↓
Auditoría de Módulos                → audit_2_passed
↓
Diseño de Aplicación (04)
↓
Aprobación Visual                   → visual_approval_passed
↓
Plan de Construcción (05)
↓
Auditoría de Ensamblado             → audit_3_passed
↓
Listo para construir                → ready_for_construction
↓
Construcción V1
↓
Auditoría de Release
↓
Refinamiento
↓
Aprobación (final/)
↓
Demo
↓
Publicación
```

---

# Etapa 1: Idea

## Objetivo

Identificar una necesidad de negocio y convertirla en una iniciativa formal.

## Resultado Esperado

Creación de una nueva estructura dentro del repositorio de productos:

```text
proyectos/
└── app/
    └── nombre-proyecto/
        ├── idea/
        ├── audits/
        ├── iterations/
        └── final/
```

> **Ruta canónica:** `proyectos/app/{proyecto}/`. No usar `applications/` como raíz de proyecto.

---

# Etapa 2: Preparación

## Objetivo

Transformar la idea en documentación estructurada capaz de ser procesada por los agentes IA de WIKA.

La documentación creada durante esta etapa representa la fuente oficial de verdad para el proyecto.

Ninguna generación de código debe comenzar sin que los gates de construcción estén en `true`.

## Orden de documentos

Completar en orden. Los documentos 03–05 no se consideran válidos para avanzar si el gate anterior está en `false`.

```text
proyectos/app/nombre-proyecto/idea/
├── 01-problem.md
├── 02-features.md
├── 03-module-discovery.md
├── 04-application-design.md
└── 05-build-plan.md
```

Usar siempre las plantillas de `templates/`.

## Resultado de la Etapa

Al finalizar la preparación de 01 y 02, el proyecto puede entrar a Auditoría de Documentación.

---

# Etapa 3: Auditoría de Documentación (Gate 1)

## Objetivo

Validar que el problema y las funcionalidades están definidos con RTM, BDD y restricciones suficientes para descubrir módulos.

Esta auditoría ocurre **antes** del descubrimiento de módulos y **antes** de generar código.

## Responsable

Arquitecto WIKA.

## Referencia

```text
docs/auditoria-documentacion.md
```

## Entradas

```text
01-problem.md
02-features.md
```

## Flag

```yaml
audit_1_passed: true
```

en el frontmatter de `01-problem.md` y `02-features.md`.

## Resultado Esperado

Registro en `proyectos/app/{proyecto}/audits/auditoria-documentacion.md`.

## Regla

Si Gate 1 es rechazado:

```text
Descubrimiento de módulos = NO PERMITIDO
Generación de código = NO PERMITIDA
```

---

# Etapa 4: Descubrimiento de Módulos

## Objetivo

Descomponer la solución en módulos reutilizables con contratos, dependencias y riesgos.

## Entrada

`templates/03-module-discovery.md` copiado a `idea/03-module-discovery.md`, con `audit_1_passed: true` como pre-requisito.

## Resultado Esperado

RTM `ERR-XX → FEAT-XX → MOD-XX` y grafo de dependencias sin ciclos.

---

# Etapa 5: Auditoría de Módulos (Gate 2)

## Objetivo

Validar cobertura, unicidad de responsabilidad y reutilización WIKA.

## Referencia

```text
docs/auditoria-modulos.md
```

## Flag

```yaml
audit_2_passed: true
```

en `03-module-discovery.md`.

## Regla

No se permite diseñar la aplicación sin aprobar esta auditoría.

---

# Etapa 6: Diseño de Aplicación

## Objetivo

Definir arquitectura, navegación (expo-router), tokens/theme y wireframe.

## Documento

`idea/04-application-design.md`

---

# Etapa 7: Aprobación Visual (Gate 3A)

## Objetivo

Obtener visto bueno del arquitecto o stakeholder sobre el wireframe / preview.

## Flag

```yaml
visual_approval_passed: true
```

en `04-application-design.md`.

No existe checklist de auditoría independiente: el visto bueno humano es el gate.

---

# Etapa 8: Plan de Construcción

## Objetivo

Definir cronograma trazable RTM (Paso N → MOD → FEAT), stack, pruebas y riesgos de V1.

## Documento

`idea/05-build-plan.md`

Este documento es **entrada** de la Auditoría de Ensamblado; no se escribe después de ella.

---

# Etapa 9: Auditoría de Ensamblado (Gate 3B) y listo para construir (Gate V1)

## Objetivo

Validar que diseño y build plan integran los módulos sin ciclos y con estrategia de construcción.

## Referencia

```text
docs/auditoria-ensamblado.md
```

## Flags

```yaml
audit_3_passed: true            # 04-application-design.md
ready_for_construction: true    # 05-build-plan.md (solo si todos los flags previos son true)
```

## Regla

```text
Si ready_for_construction: false → Construcción V1 = NO PERMITIDA
```

---

# Etapa 10: Construcción V1

## Objetivo

Transformar la documentación aprobada en una primera versión funcional.

## Entradas

### Fundamentos WIKA

```text
docs/
templates/
standards/
workflows/
agents/
.cursorrules
```

### Proyecto

```text
proyectos/app/{proyecto}/idea/
proyectos/app/{proyecto}/audits/
```

## Resultado Esperado

```text
proyectos/app/{proyecto}/iterations/v1/
```

Contenido referencial (stack Expo/RN, ver `standards/coding-standards.md`):

```text
v1/
├── app/
├── src/
│   ├── engine/
│   ├── modules/
│   └── constants/
├── scripts/
├── package.json
└── review.md
```

Verificación obligatoria:

```bash
npm run typecheck
npm run verify
```

---

# Etapa 11: Auditoría de Release

## Objetivo

Validar que la iteración cumple features obligatorias, NFRs, BDD y produce un artefacto instalable.

## Referencia

```text
docs/auditoria-release-v1.md
```

## Resultado Esperado

```text
proyectos/app/{proyecto}/audits/auditoria-release-v1.md
```

## Regla

Ninguna versión puede copiarse a `final/` ni publicarse sin aprobar esta auditoría.

---

# Etapa 12: Refinamiento

## Objetivo

Mejorar progresivamente la solución a partir de `review.md` y de la Auditoría de Release.

## Contexto obligatorio

```text
idea/
+
revisiones arquitectónicas acumuladas
+
última iteración (source)
```

No duplicar documentos de `idea/` dentro de `iterations/`.

## Resultado Esperado

```text
iterations/
├── v1/
├── v2/
├── v3/
└── vn/
```

---

# Etapa 13: Aprobación

## Objetivo

Declarar que la solución cumple los requisitos definidos y consolidarla en `final/`.

## Criterios

- Criterios BDD de `01-problem.md` cumplidos.
- Features obligatorias de `02-features.md` implementadas.
- Auditoría de Release en estado **APROBADO**.
- Arquitectura y estándares cumplidos.

## Contenido

```text
proyectos/app/{proyecto}/final/
├── source/
├── documentation/
├── apk/
└── release-notes.md
```

---

# Etapa 14: Demo

## Objetivo

Validar el producto con los interesados antes de su publicación.

## Actividades

- Demostración funcional.
- Validación de alcance.
- Validación de experiencia.
- Confirmación de expectativas.

## Resultado Esperado

```text
demo-approved.md
```

---

# Etapa 15: Publicación

## Objetivo

Liberar la solución para su utilización productiva.

## Requisitos

- Aprobación arquitectónica.
- Demo validada.
- Documentación actualizada.
- Versión final disponible.

## Resultado

```text
Estado = Producción
```

---

# Gestión de Versiones

## Versiones de Trabajo

```text
V1
V2
V3
VN
```

Representan iteraciones de refinamiento.

## Versión Final

```text
Final
```

Representa la versión aprobada para demostración o despliegue.

---

# Responsabilidades

## Negocio

- Define el problema.
- Define prioridades.
- Valida el resultado final.

## Agente IA

- Interpreta la documentación oficial.
- Respeta los flags YAML de `.cursorrules`.
- Genera soluciones e implementa mejoras.

## Arquitecto

- Ejecuta las auditorías de documentación, módulos, ensamblado y release.
- Aprueba o rechaza gates.
- Valida calidad, riesgos y arquitectura.

## WIKA

Proporciona reglas, estándares, workflows, templates, auditorías y agentes.

---

# Regla Fundamental

Dentro de WIKA una aplicación nunca comienza desde código.

```text
Documentación
↓
Gates 1 → 2 → 3A → 3B → V1
↓
Generación IA
↓
Auditoría de Release
↓
Refinamiento
↓
Aprobación
```

La documentación define el producto.

La Auditoría de Documentación (`docs/auditoria-documentacion.md`) asegura que el problema y las features pueden originar módulos.

La Auditoría de Módulos (`docs/auditoria-modulos.md`) asegura descomposición reutilizable.

La Auditoría de Ensamblado (`docs/auditoria-ensamblado.md`) asegura que diseño y build plan pueden construirse.

La IA genera la solución.

La Auditoría de Release (`docs/auditoria-release-v1.md`) asegura que la solución funciona y puede publicarse.

El arquitecto garantiza la calidad.

Ninguna aplicación podrá avanzar a Construcción V1 sin `ready_for_construction: true`.

Ninguna aplicación podrá avanzar a `final/` sin aprobar la Auditoría de Release.
