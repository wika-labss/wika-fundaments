# Documentation

## Objetivo

Definir las reglas de documentación del ecosistema WIKA.

Este documento establece:

- Qué documentación es obligatoria.
- Cuál es la fuente oficial de verdad de un proyecto.
- Cómo se utiliza la documentación durante el ciclo de vida de desarrollo.
- Cómo la documentación guía a los agentes y arquitectos.

La documentación posee el mismo nivel de importancia que el código fuente.

---

# Principios Fundamentales

## La documentación define el producto

Dentro de WIKA una aplicación no se define por el código generado.

Una aplicación se define por la documentación que describe:

- El problema.
- Las funcionalidades.
- Los módulos.
- El diseño de la solución.
- El plan de construcción.

El código es una consecuencia de la documentación.

---

## Construir capacidades antes que aplicaciones

Antes de diseñar una aplicación se deben identificar las capacidades necesarias para construirla.

Estas capacidades se documentan como módulos.

Toda solución debe analizarse desde la perspectiva de reutilización.

---

## Una única fuente de verdad

Cada información debe existir en un único lugar oficial.

La duplicación de documentación aumenta:

- Inconsistencias.
- Mantenimiento.
- Ambigüedad para agentes y arquitectos.

---

## La documentación evoluciona con el proyecto

La documentación debe actualizarse antes de iniciar nuevas iteraciones.

Los cambios en el producto deben reflejarse primero en la documentación.

---

## La IA consume documentación

Los agentes utilizan la documentación como entrada principal.

La calidad de la documentación determina la calidad de los resultados obtenidos.

---

# Fuente Oficial de Verdad

## Definición

La carpeta:

```text
idea/
```

representa la fuente oficial de verdad del proyecto.

Todo agente, arquitecto o proceso automatizado deberá considerar esta carpeta como la referencia principal.

---

## Ubicación

```text
applications/
└── proyecto/
    └── idea/
```

---

# Documentos Oficiales

Todo proyecto deberá contener:

```text
01-problem.md
02-features.md
03-module-discovery.md
04-application-design.md
05-build-plan.md
```

---

# Responsabilidad de Cada Documento

## 01-problem.md

Define:

- Problema.
- Contexto.
- Usuarios.
- Objetivos.
- Beneficios esperados.

Responde:

> ¿Por qué existe este proyecto?

---

## 02-features.md

Define:

- Funcionalidades obligatorias.
- Funcionalidades opcionales.
- Restricciones funcionales.
- Alcance.

Responde:

> ¿Qué debe hacer la solución?

---

## 03-module-discovery.md

Define:

- Capacidades necesarias.
- Responsabilidades.
- Dependencias.
- Entradas y salidas.

Responde:

> ¿Qué módulos son necesarios para construir la solución?

---

## 04-application-design.md

Define:

- Arquitectura.
- Integración de módulos.
- Flujos principales.
- Navegación.
- Interacciones.

Responde:

> ¿Cómo se conectan los módulos para formar una aplicación?

---

## 05-build-plan.md

Define:

- Alcance de la V1.
- Orden de implementación.
- Dependencias externas.
- Riesgos.
- Estrategia de pruebas.

Responde:

> ¿Cómo se construirá la solución?

---

# Estructura Documental Obligatoria

```text
applications/
└── proyecto/
    ├── idea/
    │   ├── 01-problem.md
    │   ├── 02-features.md
    │   ├── 03-module-discovery.md
    │   ├── 04-application-design.md
    │   └── 05-build-plan.md
    │
    ├── iterations/
    └── final/
```

---

# Regla de Contexto

Toda nueva iteración deberá utilizar como contexto:

```text
Documentación Oficial
+
Auditorías Acumuladas
+
Última Iteración Disponible
```

---

# Jerarquía de Información

En caso de conflicto:

```text
1. Documentación Oficial
2. Auditorías
3. Código Generado
```

---

# Resolución de Conflictos

Si una auditoría o una iteración contradice la documentación:

1. Analizar la causa.
2. Corregir la documentación si corresponde.
3. Registrar la decisión.
4. Utilizar la documentación actualizada en futuras iteraciones.

---

# Regla de No Duplicación

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

Debe existir una única versión oficial de cada documento.

---

# Responsabilidades

## Negocio

Define:

- Problema.
- Objetivos.
- Prioridades.

---

## Arquitecto

Valida:

- Consistencia.
- Cobertura funcional.
- Arquitectura.
- Calidad documental.

---

## Agentes IA

Utilizan exclusivamente:

- Documentación oficial.
- Auditorías.
- Iteraciones previas.

para generar nuevas versiones.

---

# Regla Fundamental

Dentro de WIKA la documentación tiene prioridad sobre el código.

Si existe contradicción entre el código generado y la documentación oficial:

```text
La documentación prevalece.
```

Ninguna iteración podrá modificar el comportamiento esperado de una aplicación sin actualizar primero la documentación oficial.
