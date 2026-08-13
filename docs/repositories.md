# Repositories

## Objetivo

Definir la estructura de repositorios del ecosistema WIKA y establecer las reglas para su creación, uso y mantenimiento.

Este documento existe para evitar duplicidad de responsabilidades, dispersión del conocimiento y crecimiento desordenado de la plataforma.

Todos los repositorios deben tener un propósito claro, una única responsabilidad principal y límites definidos.

---

# Principios

## Una responsabilidad por repositorio

Cada repositorio debe existir para resolver una necesidad específica.

Un repositorio no debe convertirse en un contenedor genérico de información sin relación entre sus contenidos.

Si dos repositorios cumplen la misma función, deben consolidarse o redefinirse.

---

## La documentación es obligatoria

Todo repositorio debe contener como mínimo:

```text
README.md
CHANGELOG.md
CONTRIBUTING.md
```

La ausencia de documentación implica que el repositorio no cumple los estándares de WIKA.

---

## Reutilizar antes de crear

Antes de crear un nuevo repositorio debe responderse:

- ¿Existe un repositorio donde esta información ya podría vivir?
- ¿Estamos resolviendo una responsabilidad nueva?
- ¿Este contenido será reutilizado por más de un proyecto?
- ¿La separación aporta valor real?

Si la respuesta es no, no debe crearse un nuevo repositorio.

---

## Simplicidad sobre segmentación

La creación de repositorios debe ser la excepción y no la norma.

Se prefiere una estructura simple y gobernable antes que una organización excesivamente fragmentada.

---

# Repositorios Oficiales

## wika-fundaments

Repositorio principal del sistema operativo WIKA.

Contiene las definiciones, reglas y conocimiento que permiten construir software de manera consistente.

### Responsabilidades

- Workflows
- Templates
- Standards
- Definición de agentes IA
- Documentación estratégica (reglas, auditorías, gobierno)

### No debe contener

- Aplicaciones
- Código de negocio
- Infraestructura productiva
- Productos finales

---

## platform

Framework base utilizado por las aplicaciones construidas sobre WIKA.

### Responsabilidades

- Componentes compartidos
- Librerías base
- Utilidades comunes
- Capacidades transversales

### No debe contener

- Aplicaciones de negocio
- Reglas organizacionales
- Infraestructura

---

## infrastructure

Infraestructura y automatización de la plataforma.

### Responsabilidades

- Terraform
- Cloudflare
- CI/CD
- Ambientes
- Automatizaciones de despliegue
- Observabilidad

### No debe contener

- Lógica de negocio
- Aplicaciones
- Definiciones funcionales

---

## mobile-template

Plantilla oficial para aplicaciones móviles.

### Responsabilidades

- Estructura Flutter
- Configuración inicial
- Dependencias aprobadas
- Buenas prácticas de desarrollo móvil

### No debe contener

- Funcionalidades específicas de negocio
- Aplicaciones finales

---

## backend-template

Plantilla oficial para servicios backend.

### Responsabilidades

- Arquitectura inicial
- Configuración base
- Integraciones estándar
- Seguridad base

### No debe contener

- Casos de negocio específicos
- Aplicaciones finales

---

## design-system

Sistema visual oficial de la plataforma.

### Responsabilidades

- Componentes UI
- Tokens visuales
- Guías de diseño
- Patrones de experiencia de usuario

### No debe contener

- Lógica de negocio
- Aplicaciones

---

## shared-packages

Paquetes reutilizables compartidos por múltiples soluciones.

### Responsabilidades

- Utilidades comunes
- SDK internos
- Integraciones compartidas
- Componentes reutilizables

### No debe contener

- Aplicaciones finales
- Documentación de negocio

---

## applications

Portafolio oficial de productos construidos mediante WIKA.

Este repositorio contiene todas las iniciativas, proyectos y aplicaciones desarrolladas utilizando la plataforma.

### Responsabilidades

- Aplicaciones
- Proyectos
- Iteraciones
- Entregables
- Versiones finales
- APKs
- Evidencias

### Estructura

```text
applications/
├── proyecto-a/
├── proyecto-b/
├── proyecto-c/
└── proyecto-n/
```

---

### Estructura de un proyecto

```text
proyecto/
├── idea/
├── iterations/
│   ├── v1/
│   ├── v2/
│   └── vn/
└── final/
```

#### idea

Contiene la documentación oficial que describe el proyecto.

Documentos oficiales:

```text
01-problem.md
02-features.md
03-module-discovery.md
04-application-design.md
05-build-plan.md
```

Esta documentación representa la fuente oficial de verdad para el proyecto.

---

#### iterations

Contiene las versiones generadas durante el proceso de construcción.

Cada iteración puede incluir:

```text
source/
documentation/
review.md
apk/
```

---

#### final

Contiene la versión aprobada para demostración o despliegue.

Ejemplo:

```text
final/
├── source/
├── documentation/
├── apk/
└── release-notes.md
```

---

### No debe contener

- Reglas globales
- Estándares corporativos
- Arquitectura organizacional
- Definiciones de agentes
- Templates oficiales

Estos elementos pertenecen a wika-fundaments.

---

# Creación de Nuevos Repositorios

Un nuevo repositorio sólo debe crearse cuando cumpla uno o más de los siguientes criterios:

- Tiene una responsabilidad independiente.
- Será reutilizado por múltiples soluciones.
- Tiene un ciclo de vida propio.
- Su gobierno requiere autonomía.
- Su volumen o complejidad justifica la separación.

---

# Cuándo NO Crear un Repositorio

No debe crearse un repositorio cuando:

- El contenido pertenece a un proyecto existente.
- Es documentación temporal.
- Duplica contenido existente.
- Sólo será utilizado por una única aplicación.
- La separación no aporta beneficios claros.

---

# Resolución de Dudas

Cuando exista duda sobre dónde ubicar un archivo, componente o documento:

1. Buscar primero un repositorio existente.
2. Priorizar reutilización.
3. Evitar nuevas estructuras.
4. Mantener la complejidad al mínimo.
5. Documentar la decisión cuando sea necesario.

---

# Regla Final

La simplicidad tiene prioridad sobre la segmentación.

Un repositorio debe existir porque resuelve una necesidad real y sostenida en el tiempo, no porque sea técnicamente posible crearlo.

La estructura de repositorios de WIKA debe crecer únicamente cuando la plataforma lo necesite.
