# Repositories

## Objetivo

Definir la estructura de repositorios del ecosistema WIKA.

Este documento establece:

- Qué repositorios existen.
- Qué responsabilidad tiene cada uno.
- Cuándo debe crearse un nuevo repositorio.
- Cómo evitar duplicidad y sobreingeniería.

La organización de repositorios debe mantenerse tan simple como sea posible.

---

# Principios

## Una responsabilidad por repositorio

Cada repositorio debe tener una responsabilidad principal claramente definida.

Cuando un repositorio comienza a resolver múltiples problemas distintos debe evaluarse su división.

---

## Simplicidad sobre segmentación

La creación de nuevos repositorios debe ser una excepción.

Antes de separar contenido debe demostrarse que la separación aporta un beneficio real.

---

## Reutilizar antes de crear

Antes de crear un repositorio nuevo debe responderse:

- ¿Ya existe un lugar adecuado para este contenido?
- ¿La responsabilidad es realmente nueva?
- ¿Existirá reutilización futura?
- ¿La separación reduce complejidad?

Si la respuesta es no, el repositorio no debe crearse.

---

## El repositorio sigue a la responsabilidad

Los repositorios no se crean por tipo de tecnología.

Se crean cuando existe una responsabilidad claramente diferenciada.

---

# Repositorios Oficiales

Actualmente WIKA opera con una estructura mínima.

---

## wika-fundaments

Repositorio principal del sistema operativo WIKA.

Representa la fuente oficial de estándares, procesos y conocimiento.

### Responsabilidades

- Gobierno
- Standards
- Workflows
- Templates
- Auditorías
- Definición de agentes
- Documentación estratégica

### Estructura

```text
wika-fundaments/

├── README.md
├── docs/
├── standards/
├── templates/
├── workflows/
└── agents/
```

### No debe contener

- Aplicaciones
- Productos finales
- Código de negocio
- Iteraciones de proyectos

---

## applications

Portafolio oficial de soluciones construidas utilizando WIKA.

Contiene iniciativas, proyectos y productos.

### Responsabilidades

- Proyectos
- Iteraciones
- Entregables
- Aplicaciones
- Versiones finales
- Evidencias

### Estructura

```text
applications/

├── proyecto-a/
├── proyecto-b/
└── proyecto-n/
```

---

# Estructura de Proyecto

Todo proyecto debe seguir la siguiente estructura.

```text
proyecto/

├── idea/
├── iterations/
└── final/
```

---

## idea

Representa la definición oficial del producto.

Es la fuente de verdad del proyecto.

### Documentación Obligatoria

```text
01-problem.md
02-features.md
03-module-discovery.md
04-application-design.md
05-build-plan.md
```

---

### Responsabilidad

Define:

- Qué problema se resuelve.
- Qué funcionalidades existen.
- Qué módulos son necesarios.
- Cómo se diseña la solución.
- Cómo se construirá.

---

## iterations

Contiene las versiones generadas durante el desarrollo.

Ejemplo:

```text
iterations/
├── v1/
├── v2/
├── v3/
└── vn/
```

---

Cada iteración puede contener:

```text
source/
review.md
generation-report.md
artifacts/
```

Las iteraciones no representan la fuente oficial de verdad.

---

## final

Contiene la versión aprobada para liberación o publicación.

Ejemplo:

```text
final/

├── source/
├── artifacts/
└── release-notes.md
```

---

# Creación de Nuevos Repositorios

Un nuevo repositorio sólo podrá crearse cuando cumpla al menos una de estas condiciones.

## Responsabilidad independiente

Resuelve un problema distinto al resto de repositorios existentes.

---

## Ciclo de vida independiente

Tiene versiones, mantenimiento o evolución propia.

---

## Reutilización transversal

Será utilizado por múltiples proyectos.

---

## Gobierno independiente

Requiere permisos, revisiones o responsables distintos.

---

# Cuándo NO Crear un Repositorio

No crear un repositorio si:

- El contenido pertenece a un proyecto existente.
- Es documentación temporal.
- Sólo será utilizado por una aplicación.
- Duplica responsabilidades existentes.
- La separación no aporta beneficios claros.

---

# Evolución Futura

WIKA podrá incorporar nuevos repositorios cuando exista evidencia de que 
