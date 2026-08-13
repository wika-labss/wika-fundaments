# Application Lifecycle

## Objetivo

Definir el ciclo de vida oficial de una aplicación dentro del ecosistema WIKA.

Este workflow establece cómo una idea se transforma en una solución funcional mediante documentación estructurada, auditorías arquitectónicas y agentes de inteligencia artificial.

Todo proyecto desarrollado bajo WIKA debe seguir este proceso.

---

# Filosofía

WIKA se basa en cinco principios fundamentales:

- La documentación define el producto.
- La Auditoría 1 asegura que el proyecto puede construirse.
- La inteligencia artificial genera la solución.
- La Auditoría 2 asegura que la solución funciona.
- El arquitecto garantiza la calidad.

Ninguna aplicación debe desarrollarse fuera de este flujo.

---

# Ciclo de Vida

```text
Idea
↓
Preparación
↓
Auditoría 1
↓
Generación IA
↓
Auditoría 2
↓
Refinamiento
↓
Aprobación
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

Creación de una nueva estructura dentro del repositorio de aplicaciones.

```text
applications/
└── nombre-proyecto/
```

## Estructura Inicial

```text
applications/
└── nombre-proyecto/
    ├── idea/
    ├── iterations/
    └── final/
```

---

# Etapa 2: Preparación

## Objetivo

Transformar la idea en documentación estructurada capaz de ser procesada por los agentes IA de WIKA.

La documentación creada durante esta etapa representa la fuente oficial de verdad para el proyecto.

Ninguna generación debe comenzar sin que esta etapa haya sido completada.

## Estructura

```text
applications/
└── nombre-proyecto/
    └── idea/
        ├── 01-problem.md
        ├── 02-features.md
        ├── 03-module-discovery.md
        ├── 04-application-design.md
        └── 05-build-plan.md
```

---

## 01-problem.md

Documento oficial del problema a resolver.

---

## 02-features.md

Documento oficial de funcionalidades del proyecto.

---

## 03-module-discovery.md

Documento oficial de descubrimiento de módulos.

---

## 04-application-design.md

Documento oficial de diseño de la aplicación.

---

## 05-build-plan.md

Documento oficial del plan de build y entrega.

---

## Resultado de la Etapa

Al finalizar la preparación, el proyecto debe contener toda la información necesaria para que un agente IA pueda generar una primera versión funcional sin depender de explicaciones adicionales.

La calidad de la generación estará directamente relacionada con la calidad de la documentación proporcionada.

---

# Etapa 3: Auditoría 1

## Objetivo

Validar que la documentación contiene toda la información necesaria para generar una aplicación compilable y capaz de producir un artefacto instalable.

Esta auditoría ocurre antes de generar código.

## Responsable

Arquitecto WIKA.

## Referencia

```text
docs/auditoria-1.md
```

## Entradas

```text
01-problem.md
02-features.md
03-module-discovery.md
04-application-design.md
05-build-plan.md
```

## Validaciones

### Requerimientos

- Objetivo definido.
- Alcance definido.
- Entregable definido.

### Arquitectura

- Stack tecnológico definido.
- Dependencias identificadas.
- Restricciones documentadas.

### Build

- SDK definido.
- JDK definido.
- Kotlin definido.
- Pipeline de compilación documentado.

### Entregable

Debe estar definido explícitamente:

- APK Release
- AAB
- Docker
- Aplicación Web
- Otro

## Resultado Esperado

```text
audit-1.md
```

## Regla

La Auditoría 1 debe ejecutarse siguiendo las validaciones descritas en:

```text
docs/auditoria-1.md
```

Si la Auditoría 1 es rechazada:

```text
Generación IA = NO PERMITIDA
```

---

# Etapa 4: Generación IA

## Objetivo

Transformar la documentación estructurada en una primera versión funcional de la aplicación.

## Entradas

### Fundamentos WIKA

```text
docs/
templates/
standards/
workflows/
agents/
```

### Proyecto

```text
applications/proyecto/idea/
```

## Proceso

El agente IA deberá:

- Leer la documentación oficial del proyecto.
- Respetar la Auditoría 1.
- Aplicar las reglas definidas por WIKA.
- Aplicar los estándares técnicos vigentes.
- Respetar las restricciones arquitectónicas indicadas.
- Generar una solución funcional inicial.

## Resultado Esperado

```text
iterations/
└── v1/
```

## Contenido Referencial

```text
v1/
├── source/
├── documentation/
├── apk/
└── generation-report.md
```

---

# Etapa 5: Auditoría 2

## Objetivo

Validar que la solución generada cumple los requerimientos funcionales, técnicos y operacionales.

## Responsable

Arquitecto WIKA.

## Referencia

```text
docs/auditoria-2.md
```

## Entradas

- Código generado.
- Documentación del proyecto.
- Auditoría 1.
- Versiones previas.

## Validaciones

### Compilación

- TypeScript.
- Dependencias.
- Build.
- APK Release.

### Arquitectura

- Cumplimiento de arquitectura.
- Cumplimiento de estándares.
- Calidad de implementación.

### Funcionalidad

- Cumplimiento de requerimientos.
- Casos de uso.
- Estados y flujos.

### Runtime

- Hardware.
- Permisos.
- Ciclo de vida.
- Dispositivo físico.

## Resultado Esperado

```text
review-v1.md
```

## Resultado

```text
APROBADO
```

o

```text
REQUIERE V2
```

o

```text
RECHAZADO
```

## Regla

La Auditoría 2 debe ejecutarse siguiendo las validaciones descritas en:

```text
docs/auditoria-2.md
```

Toda V1 debe superar la Auditoría 2 antes de avanzar a refinamiento o aprobación.

---

# Etapa 6: Refinamiento

## Objetivo

Mejorar progresivamente la solución a partir de la Auditoría 2.

## Entradas

```text
Documentación Original
+
Auditoría 2
+
Versiones Previas
```

## Proceso

El agente IA genera una nueva versión considerando:

- Requerimientos originales.
- Restricciones existentes.
- Hallazgos detectados.
- Problemas identificados.
- Observaciones arquitectónicas.

## Resultado Esperado

```text
iterations/
├── v1/
├── v2/
├── v3/
└── vn/
```

## Regla de Refinamiento

No existe un límite definido de versiones.

El proceso continuará hasta que el arquitecto considere que la solución cumple los criterios esperados.

Toda versión V2 o superior deberá corregir los hallazgos identificados durante la Auditoría 2.

---

# Etapa 7: Aprobación

## Objetivo

Declarar que la solución cumple los requisitos funcionales, técnicos y operacionales definidos.

## Criterios de Aprobación

### Negocio

- Problema resuelto.
- Funcionalidades completadas.

### Técnica

- Auditoría 2 aprobada.
- Arquitectura validada.
- Estándares cumplidos.

### Operacional

- Lista para demostración.

## Resultado Esperado

```text
final/
```

## Contenido

```text
final/
├── source/
├── documentation/
├── apk/
└── release-notes.md
```

---

# Etapa 8: Demo

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

# Etapa 9: Publicación

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

- Interpreta la documentación.
- Genera soluciones.
- Implementa mejoras.
- Produce nuevas versiones.

## Arquitecto

- Ejecuta Auditoría 1.
- Ejecuta Auditoría 2.
- Valida calidad.
- Evalúa riesgos.
- Revisa arquitectura.
- Aprueba o rechaza versiones.

## WIKA

Proporciona:

- Reglas.
- Estándares.
- Arquitectura.
- Workflows.
- Templates.
- Auditorías.
- Agentes.
- Funciones.

---

# Regla Fundamental

Dentro de WIKA una aplicación nunca comienza desde código.

Toda aplicación debe seguir el siguiente principio:

```text
Documentación
↓
Auditoría 1
↓
Generación IA
↓
Auditoría 2
↓
Refinamiento
↓
Aprobación
```

La documentación define el producto.

La Auditoría 1 (docs/auditoria-1.md) asegura que el proyecto puede construirse y generar un artefacto instalable.

La IA genera la solución.

La Auditoría 2 (docs/auditoria-2.md) asegura que la solución funciona correctamente y cumple los requisitos definidos.

El arquitecto garantiza la calidad.

Ninguna aplicación podrá avanzar a Generación IA sin aprobar la Auditoría 1.

Ninguna aplicación podrá avanzar a final/ sin aprobar la Auditoría 2.
