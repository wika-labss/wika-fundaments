# Documentation

## Objetivo

Definir las reglas de documentación del ecosistema WIKA.

Este documento establece qué documentación es obligatoria, cuál es la fuente oficial de verdad de cada proyecto y cómo debe utilizarse durante los procesos de generación, revisión y refinamiento.

La documentación es un componente fundamental de WIKA y posee el mismo nivel de importancia que el código fuente.

---

# Principios Fundamentales

## La documentación define el producto

Dentro de WIKA una aplicación no se define por su código.

Una aplicación se define por la documentación que describe:

- El problema.
- Las funcionalidades.
- La arquitectura.
- El diseño.
- Las instrucciones de generación.

El código generado es una consecuencia de la documentación.

---

## Una única fuente de verdad

Cada información debe existir en un único lugar oficial.

La duplicación de documentación aumenta el riesgo de inconsistencias y dificulta el mantenimiento de los proyectos.

Toda información debe tener una ubicación oficial y claramente definida.

---

## La documentación evoluciona con el proyecto

La documentación no es estática.

Cuando cambian los requisitos, restricciones o decisiones arquitectónicas, la documentación debe actualizarse antes de ejecutar nuevas generaciones.

---

## La IA consume documentación

Los agentes IA utilizan la documentación como entrada principal para generar soluciones.

La calidad de la documentación influye directamente en la calidad de los resultados obtenidos.

---

# Fuente Oficial de Verdad

## Definición

La carpeta:

```text
idea/
```

representa la fuente oficial de verdad de cada proyecto.

Todos los agentes, arquitectos y participantes del proyecto deben considerar esta carpeta como la referencia principal del producto.

---

## Ubicación

```text
applications/
└── proyecto/
    └── idea/
```

---

## Documentos Oficiales

La documentación obligatoria para un proyecto es:

```text
01-problem.md
02-features.md
03-architecture.md
04-design.md
05-prompt-ia.md
```

---

## Responsabilidad

La información contenida en estos documentos define oficialmente:

- Qué problema se resuelve.
- Qué funcionalidades deben existir.
- Cómo debe construirse la solución.
- Cómo debe verse la solución.
- Cómo debe comportarse el proceso de generación.

---

# Estructura Documental Obligatoria

## Documentación del Proyecto

Todo proyecto deberá contener:

```text
applications/
└── proyecto/
    ├── idea/
    │   ├── 01-problem.md
    │   ├── 02-features.md
    │   ├── 03-architecture.md
    │   ├── 04-design.md
    │   └── 05-prompt-ia.md
    │
    ├── iterations/
    └── final/
```

---

## Descripción de los Documentos

### 01-problem.md

Define el problema que origina el proyecto.

Debe describir:

- Problema.
- Usuarios afectados.
- Contexto.
- Beneficios esperados.

---

### 02-features.md

Define las funcionalidades requeridas.

Debe describir:

- Funcionalidades principales.
- Funcionalidades secundarias.
- Reglas de negocio.
- Restricciones funcionales.

---

### 03-architecture.md

Define criterios técnicos y arquitectónicos.

Debe describir:

- Tecnologías.
- Integraciones.
- Restricciones técnicas.
- Consideraciones de seguridad.

---

### 04-design.md

Define la experiencia de usuario.

Puede incluir:

- Wireframes.
- Bocetos.
- Flujos de navegación.
- Referencias visuales.

---

### 05-prompt-ia.md

Define instrucciones específicas para el agente IA.

Puede incluir:

- Prioridades.
- Restricciones especiales.
- Objetivos de generación.
- Formato esperado de entrega.

---

# Documentación de Iteraciones

## Objetivo

Registrar la evolución de una solución a lo largo del proceso de refinamiento.

---

## Estructura

```text
iterations/
├── v1/
├── v2/
├── v3/
└── vn/
```

---

## Contenido Mínimo

Cada iteración deberá contener como mínimo:

```text
review.md
```

Opcionalmente podrá incluir:

```text
source/
apk/
generation-report.md
documentation/
```

---

## Alcance

Las iteraciones contienen únicamente artefactos relacionados con una versión específica.

No representan la fuente oficial de verdad del proyecto.

---

# Documentación Final

## Objetivo

Registrar la versión aprobada para demostración o publicación.

---

## Estructura

```text
final/
├── source/
├── documentation/
├── apk/
└── release-notes.md
```

---

## Documento Obligatorio

```text
release-notes.md
```

Debe registrar:

- Funcionalidades implementadas.
- Cambios relevantes.
- Consideraciones de despliegue.
- Información de la versión.

---

# Regla de Contexto

## Principio

Toda nueva generación debe construirse utilizando el contexto completo del proyecto.

Ninguna generación debe basarse únicamente en la última versión producida.

---

## Contexto Obligatorio

Toda nueva ejecución deberá utilizar:

```text
Documentación Original
+
Comentarios Arquitectónicos Acumulados
+
Última Versión Disponible
```

---

## Ejemplo

Para generar una V2:

```text
idea/
+
iterations/v1/review.md
+
iterations/v1/source/
```

---

Para generar una V3:

```text
idea/
+
iterations/v1/review.md
+
iterations/v2/review.md
+
iterations/v2/source/
```

---

# Prioridad de Información

## Jerarquía

En caso de conflicto, la prioridad será:

```text
1. Documentación Original (idea/)
2. Revisiones Arquitectónicas
3. Código Generado
```

---

## Resolución de Conflictos

Si una revisión contradice la documentación original:

1. Debe analizarse la causa.
2. Debe actualizarse la documentación oficial si corresponde.
3. Debe registrarse la decisión.
4. Las siguientes generaciones deberán utilizar la documentación actualizada.

---

# Regla de No Duplicación

## Prohibición

Los documentos contenidos en:

```text
idea/
```

no deben copiarse dentro de:

```text
iterations/
```

ni dentro de:

```text
final/
```

---

## Justificación

La duplicación genera:

- Inconsistencias.
- Sobrecarga de mantenimiento.
- Ambigüedad para los agentes IA.
- Aumento innecesario del contexto.

---

## Regla

Debe existir una única versión oficial de cada documento.

---

# Responsabilidades

## Negocio

Es responsable de mantener actualizada la documentación funcional.

---

## Arquitecto

Es responsable de validar la consistencia entre la documentación y las soluciones generadas.

---

## Agentes IA

Deben utilizar exclusivamente la documentación oficial y las revisiones disponibles para producir nuevas versiones.

---

# Regla Fundamental

Dentro de WIKA la documentación tiene prioridad sobre el código.

Si existe contradicción entre el código generado y la documentación oficial:

```text
La documentación prevalece.
```

Los agentes IA deberán utilizar siempre la documentación oficial como fuente primaria para cualquier nueva generación o refinamiento.
