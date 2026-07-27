# Application Lifecycle

## Objetivo

Definir el ciclo de vida oficial de una aplicación dentro del ecosistema WIKA.

Este workflow establece cómo una idea se transforma en una solución funcional mediante la colaboración entre documentación estructurada, agentes de inteligencia artificial y revisión arquitectónica.

Todo proyecto desarrollado bajo WIKA debe seguir este proceso.

---

# Filosofía

WIKA se basa en tres principios fundamentales:

1. La documentación define el producto.
2. La inteligencia artificial genera la solución.
3. El arquitecto garantiza la calidad.

Ninguna aplicación debe desarrollarse fuera de este flujo.

---

# Ciclo de Vida

```text
Idea
↓
Preparación
↓
Generación IA
↓
Revisión Arquitectónica
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

---

## Resultado Esperado

Creación de una nueva estructura dentro del repositorio de aplicaciones.

```text
applications/
└── nombre-proyecto/
```

---

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

---

## Estructura

```text
applications/
└── nombre-proyecto/
    └── idea/
        ├── 01-problem.md
        ├── 02-features.md
        ├── 03-architecture.md
        ├── 04-design.md
        └── 05-prompt-ia.md
```

---

## 01-problem.md

### Objetivo

Definir claramente el problema que se desea resolver.

### Debe responder

- ¿Qué problema existe?
- ¿Quién tiene el problema?
- ¿Cómo se resuelve actualmente?
- ¿Cuál es el impacto del problema?
- ¿Qué beneficio se espera obtener?

### Resultado Esperado

Comprensión clara de la necesidad de negocio.

---

## 02-features.md

### Objetivo

Definir las capacidades funcionales esperadas de la solución.

### Debe contener

- Funcionalidades principales.
- Funcionalidades secundarias.
- Reglas de negocio.
- Restricciones funcionales.
- Casos de uso relevantes.

### Resultado Esperado

Lista clara y priorizada de funcionalidades.

---

## 03-architecture.md

### Objetivo

Definir restricciones técnicas y criterios arquitectónicos del proyecto.

### Debe contener

- Tecnologías requeridas.
- Integraciones necesarias.
- Servicios externos.
- Requisitos de almacenamiento.
- Consideraciones de seguridad.
- Restricciones técnicas.

### Resultado Esperado

Marco técnico que deberá respetar la generación.

---

## 04-design.md

### Objetivo

Definir la experiencia esperada para el usuario.

### Puede incluir

- Wireframes.
- Bocetos.
- Flujos de navegación.
- Referencias visuales.
- Capturas de pantalla.
- Comentarios de experiencia de usuario.

### Resultado Esperado

Visión clara de cómo debería verse y utilizarse la solución.

---

## 05-prompt-ia.md

### Objetivo

Definir instrucciones específicas para la generación realizada por IA.

Este documento complementa la documentación del proyecto y proporciona contexto adicional para el agente.

### Puede incluir

- Prioridades de desarrollo.
- Restricciones especiales.
- Criterios de calidad.
- Consideraciones de implementación.
- Formato de entrega esperado.
- Instrucciones adicionales.

### Resultado Esperado

Instrucciones claras que permitan optimizar la generación de una primera versión funcional.

---

## Resultado de la Etapa

Al finalizar la preparación, el proyecto debe contener toda la información necesaria para que un agente IA pueda generar una primera versión funcional sin depender de explicaciones adicionales.

La calidad de la generación estará directamente relacionada con la calidad de la documentación proporcionada.

---

# Etapa 3: Generación IA

## Objetivo

Transformar la documentación estructurada en una primera versión funcional de la aplicación.

---

## Entradas

### Fundamentos WIKA

```text
rules/
templates/
standards/
architecture/
functions/
```

### Proyecto

```text
applications/proyecto/idea/
```

---

## Proceso

El agente IA deberá:

1. Leer la documentación oficial del proyecto.
2. Aplicar las reglas definidas por WIKA.
3. Respetar los estándares técnicos vigentes.
4. Respetar las restricciones arquitectónicas indicadas.
5. Generar una solución funcional inicial.

---

## Resultado Esperado

```text
iterations/
└── v1/
```

---

## Contenido Referencial

```text
v1/
├── source/
├── documentation/
├── apk/
└── generation-report.md
```

---

# Etapa 4: Revisión Arquitectónica

## Objetivo

Evaluar la calidad de la solución generada y determinar las mejoras necesarias.

---

## Responsable

Arquitecto de Software.

---

## Validaciones

### Funcionales

- Cumplimiento de requerimientos.
- Cumplimiento de reglas de negocio.
- Cobertura de funcionalidades definidas.

### Técnicas

- Cumplimiento de arquitectura.
- Cumplimiento de estándares.
- Calidad de implementación.

### Experiencia de Usuario

- Navegación.
- Consistencia visual.
- Usabilidad.

---

## Resultado Esperado

Documento formal de revisión.

```text
review-v1.md
```

---

## Contenido Mínimo

```text
Observaciones
Hallazgos
Errores
Riesgos
Mejoras
Resultado Final
```

---

# Etapa 5: Refinamiento

## Objetivo

Mejorar progresivamente la solución a partir de la revisión arquitectónica.

---

## Entradas

```text
Documentación Original
+
Comentarios Arquitectónicos
+
Versiones Previas
```

---

## Proceso

El agente IA genera una nueva versión considerando:

- Requerimientos originales.
- Restricciones existentes.
- Observaciones de revisión.
- Problemas detectados.

---

## Resultado Esperado

```text
iterations/
├── v1/
├── v2/
├── v3/
└── vn/
```

---

## Regla de Refinamiento

No existe un límite definido de versiones.

El proceso continuará hasta que el arquitecto considere que la solución cumple los criterios esperados.

---

# Etapa 6: Aprobación

## Objetivo

Declarar que la solución cumple los requisitos funcionales, técnicos y operacionales definidos.

---

## Criterios de Aprobación

### Negocio

- Problema resuelto.
- Funcionalidades completadas.

### Técnica

- Arquitectura validada.
- Estándares cumplidos.

### Operacional

- Lista para demostración.

---

## Resultado Esperado

Generación de la versión final.

```text
final/
```

---

## Contenido

```text
final/
├── source/
├── documentation/
├── apk/
└── release-notes.md
```

---

# Etapa 7: Demo

## Objetivo

Validar el producto con los interesados antes de su publicación.

---

## Actividades

- Demostración funcional.
- Validación de alcance.
- Validación de experiencia.
- Confirmación de expectativas.

---

## Resultado Esperado

```text
demo-approved.md
```

---

# Etapa 8: Publicación

## Objetivo

Liberar la solución para su utilización productiva.

---

## Requisitos

- Aprobación arquitectónica.
- Demo validada.
- Documentación actualizada.
- Versión final disponible.

---

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

---

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

---

## Agente IA

- Interpreta la documentación.
- Genera soluciones.
- Implementa mejoras.
- Produce nuevas versiones.

---

## Arquitecto

- Valida calidad.
- Evalúa riesgos.
- Revisa arquitectura.
- Aprueba o rechaza versiones.

---

## WIKA

Proporciona:

- Reglas
- Estándares
- Arquitectura
- Workflows
- Templates
- Agentes
- Funciones

---

# Regla Fundamental

Dentro de WIKA una aplicación nunca comienza desde código.

Toda aplicación debe seguir el siguiente principio:

```text
Documentación
↓
Generación IA
↓
Revisión Arquitectónica
↓
Refinamiento
↓
Aprobación
```

La documentación define el producto.

La IA genera la solución.

El arquitecto garantiza la calidad.

La calidad del resultado dependerá directamente de la calidad de la documentación entregada al proceso.
