# WIKA

## Software Company Operating System (SCOS)

WIKA es el sistema operativo de desarrollo de la empresa.

No es una aplicación, framework o producto específico.

Es el conjunto de estándares, procesos, documentación, automatizaciones, agentes de inteligencia artificial y reglas que permiten diseñar, construir, documentar, revisar, publicar y mantener software de forma consistente.

Su objetivo es transformar el desarrollo de software en un proceso repetible, escalable y asistido por IA.

---

# Visión

Construir una fábrica de software asistida por inteligencia artificial capaz de generar soluciones de negocio de manera rápida, consistente y escalable mediante la reutilización de conocimiento, componentes y procesos.

---

# Principios

## La documentación define el producto

Todo proyecto comienza con documentación.

Los agentes IA no crean productos desde cero ni interpretan ideas ambiguas.

Trabajan únicamente sobre documentos oficiales generados por el negocio y validados por los responsables del proyecto.

---

## Reutilizar antes de construir

Antes de crear algo nuevo se evalúa:

- Estándares existentes.
- Componentes existentes.
- Plantillas existentes.
- Soluciones existentes.

La prioridad siempre es reutilizar conocimiento previamente validado.

---

## Los agentes generan

La inteligencia artificial construye.

Los agentes son responsables de transformar documentación en entregables funcionales.

---

## Los arquitectos validan

La responsabilidad final siempre es humana.

Los arquitectos revisan, prueban y aprueban cada iteración antes de avanzar.

---

## Todo debe poder repetirse

Si un proyecto fue exitoso, el proceso utilizado debe poder aplicarse nuevamente en futuros proyectos.

El conocimiento generado debe quedar documentado para reutilización.

---

# Cómo funciona WIKA

El ciclo de vida de una aplicación dentro de WIKA se define en `workflows/application-lifecycle.md`:

```text
Idea
↓
Preparación
↓
Auditoría de Documentación
↓
Descubrimiento de Módulos
↓
Auditoría de Módulos
↓
Diseño de Aplicación
↓
Aprobación Visual
↓
Auditoría de Ensamblado
↓
Construcción V1
↓
Auditoría de Release
↓
Refinamiento
↓
Publicación
```

---

# Estructura del repositorio

```text
wika-fundaments/
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── ROADMAP.md
├── .cursorrules      # Quality gates para agentes IA
├── agents/           # Definición de agentes IA
├── docs/             # Guías, reglas y auditorías
│   ├── instructivo-nuevos-usuarios.md
│   ├── documentation.md
│   ├── repositories.md
│   ├── auditoria-documentacion.md
│   ├── auditoria-modulos.md
│   ├── auditoria-ensamblado.md
│   └── auditoria-release-v1.md
├── standards/        # Estándares técnicos y funcionales
├── templates/        # Plantillas oficiales de documentación
│   ├── 01-problem.md
│   ├── 02-features.md
│   ├── 03-module-discovery.md
│   ├── 04-application-design.md
│   └── 05-build-plan.md
├── workflows/        # Procesos oficiales de trabajo
│   └── application-lifecycle.md
├── scripts/          # Validación de consistencia documental
└── tests/            # Tests del validador de docs
```

## Responsabilidad de este repositorio

`wika-fundaments` contiene las definiciones, reglas y conocimiento que permiten construir software de manera consistente.

No debe contener aplicaciones, código de negocio ni productos finales.

Las aplicaciones viven en el repositorio `proyectos`, bajo `proyectos/app/{proyecto}/`.

---

# Documentación oficial de un proyecto

Durante la Preparación, cada proyecto debe crear en `proyectos/app/{proyecto}/idea/`:

```text
01-problem.md
02-features.md
03-module-discovery.md
04-application-design.md
05-build-plan.md
```

Las auditorías del proyecto se registran en `proyectos/app/{proyecto}/audits/`.

Usar siempre las plantillas de `templates/`.

---

# Guía para nuevos usuarios

Si es tu primera vez en WIKA, lee el instructivo completo:

→ [`docs/instructivo-nuevos-usuarios.md`](docs/instructivo-nuevos-usuarios.md)

Resume cómo **comienza** el flujo (idea → documentación → gates) y cómo **finaliza** (release → `final/` → publicación).
