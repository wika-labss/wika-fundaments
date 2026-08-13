# Auditoría 2 - Revisión de Código y Runtime

## Objetivo

Validar que la implementación generada cumple los requerimientos, la arquitectura, el diseño y los estándares definidos para el proyecto.

Esta auditoría se ejecuta después de generar la V1 y antes de aprobar una versión final.

Su propósito es detectar errores funcionales, defectos de compilación, problemas arquitectónicos, riesgos de runtime, incumplimientos de diseño y oportunidades de mejora.

---

# Principio

La Auditoría 1 responde:

> ¿Tenemos suficiente información para generar una aplicación compilable?

La Auditoría 2 responde:

> ¿La aplicación realmente funciona y cumple lo que se prometió?

---

# Criterio de aprobación

Resultado posible:

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

---

# Regla WIKA

Toda V1 debe pasar obligatoriamente por Auditoría 2.

Ninguna aplicación puede avanzar a:

```text
final/
```

sin una Auditoría 2 aprobada.

---

# Documentos obligatorios a revisar

La auditoría debe contrastar el código contra:

```text
01-problem.md

02-features.md

03-module-discovery.md

04-application-design.md

05-build-plan.md

knowledge-base.md
```

El código se considera una implementación de estos documentos.

---

# 1. Diagnóstico General

## Objetivo

Determinar el estado general de la aplicación antes de realizar la revisión detallada.

---

## Responder

### ¿Compila?

```text
Sí / No
```

### ¿Genera artefacto?

```text
Sí / No
```

### ¿Puede instalarse?

```text
Sí / No
```

### ¿Cumple el objetivo principal?

```text
Sí / No
```

---

# 2. Revisión de Compilación

## Objetivo

Confirmar que la aplicación puede construirse de forma reproducible.

---

## Gates obligatorios

### TypeScript

```bash
npx tsc --noEmit
```

Resultado esperado:

```text
exit 0
```

---

### Dependencias

```bash
npm install
```

Resultado esperado:

```text
sin errores
```

---

### Expo Doctor

```bash
npx expo-doctor
```

Resultado esperado:

```text
0 errores
```

---

### Prebuild

```bash
npx expo prebuild --platform android
```

Resultado esperado:

```text
sin errores
```

---

### Release

```bash
./gradlew assembleRelease
```

Resultado esperado:

```text
BUILD SUCCESSFUL
```

---

## Hallazgos Críticos

Ejemplos:

- No compila.
- Falla el APK Release.
- Dependencias incompatibles.
- Configuración incompleta.
- Error de SDK.

---

# 3. Revisión de Dependencias

## Objetivo

Detectar riesgos relacionados con librerías y versiones.

---

## Validaciones

- [ ] Dependencias necesarias.
- [ ] Sin dependencias duplicadas.
- [ ] Sin versiones incompatibles.
- [ ] Sin dependencias implícitas.
- [ ] Versiones alineadas al estándar del proyecto.

---

## Archivos a revisar

```text
package.json
app.json
eas.json
build.gradle
gradle.properties
```

Cuando corresponda.

---

# 4. Revisión Arquitectónica

## Objetivo

Confirmar que la implementación respeta la arquitectura aprobada.

---

## Responsabilidades

Validar:

- [ ] Separación de capas.
- [ ] Componentes reutilizables.
- [ ] Motores aislados.
- [ ] Servicios desacoplados.
- [ ] Dependencias claras.

---

## Código

Detectar:

- [ ] Código duplicado.
- [ ] Responsabilidades mezcladas.
- [ ] Acoplamiento excesivo.
- [ ] Complejidad innecesaria.
- [ ] Sobreingeniería.

---

## Consistencia

Validar:

- [ ] Estructura coherente.
- [ ] Naming consistente.
- [ ] Organización uniforme.

---

# 5. Revisión Funcional

## Objetivo

Comprobar el cumplimiento de los requerimientos.

---

## Checklist

### Funcionalidad principal

- [ ] Cumple el objetivo principal.
- [ ] Todos los casos descritos funcionan.

### Funcionalidades secundarias

- [ ] Funcionan correctamente.
- [ ] Respetan el alcance aprobado.

---

## Casos límite

Validar:

- [ ] Valores vacíos.
- [ ] Valores mínimos.
- [ ] Valores máximos.
- [ ] Datos inválidos.
- [ ] Permisos denegados.
- [ ] Hardware no disponible.

---

# 6. Revisión de Estado y Flujo

## Objetivo

Detectar inconsistencias de comportamiento.

---

## Validar

### Loading

- [ ] Muestra estado de carga.
- [ ] Sale correctamente del estado.

### Éxito

- [ ] Actualiza interfaz.
- [ ] Actualiza datos.

### Error

- [ ] Captura excepciones.
- [ ] Informa correctamente.

### Vacío

- [ ] Maneja ausencia de datos.

---

# 7. Revisión de Runtime

## Objetivo

Detectar problemas que solo aparecen durante la ejecución.

---

## Hardware

Cuando aplique:

- [ ] Cámara.
- [ ] Flash.
- [ ] Bluetooth.
- [ ] GPS.
- [ ] Sensores.

---

## Permisos

Validar:

- [ ] Solicitud correcta.
- [ ] Denegación correcta.
- [ ] Recuperación correcta.

---

## Ciclo de vida

Validar:

- [ ] Inicio.
- [ ] Background.
- [ ] Foreground.
- [ ] Cierre.

---

## Recursos

Detectar:

- [ ] Timers huérfanos.
- [ ] Listeners huérfanos.
- [ ] Memory leaks.
- [ ] Procesos sin cleanup.

---

# 8. Revisión de Diseño

## Objetivo

Validar cumplimiento de 04-application-design.md.

---

## Visual

- [ ] Colores.
- [ ] Tipografía.
- [ ] Espaciados.
- [ ] Componentes.
- [ ] Iconografía.

---

## Experiencia

- [ ] Navegación intuitiva.
- [ ] Estados claros.
- [ ] Acciones comprensibles.

---

# 9. Validación en Dispositivo Físico

## Objetivo

Confirmar funcionamiento real.

---

## Regla WIKA

Toda aplicación móvil debe validarse en un dispositivo físico.

No basta con:

```text
Expo Go
Emulador
Simulador
```

---

## Checklist

- [ ] APK instalada.
- [ ] Aplicación inicia.
- [ ] Función principal validada.
- [ ] No existen bloqueos evidentes.
- [ ] No existen errores críticos visibles.

---

# 10. Revisión contra Knowledge Base

## Objetivo

Evitar repetir errores ya descubiertos por WIKA.

---

## Fuente

```text
docs/engineering/audits/knowledge-base.md
```

---

## Validar

- [ ] No viola reglas existentes.
- [ ] No repite errores conocidos.
- [ ] Cumple estándares actualizados.

---

## Hallazgos nuevos

Todo hallazgo relevante debe convertirse en:

- Actualización de knowledge-base.md
- Actualización de templates
- Actualización de estándares
- Nueva regla de auditoría

---

# Clasificación de Hallazgos

## 🔴 Crítico

Impide cumplir el objetivo principal.

Ejemplos:

- No compila.
- APK no genera.
- Crash.
- Función principal inutilizable.

---

## 🟠 Alto

Problema importante.

Ejemplos:

- Arquitectura incorrecta.
- Dependencias incompatibles.
- Error frecuente de runtime.

---

## 🟡 Medio

Impacta mantenibilidad o calidad.

Ejemplos:

- Código duplicado.
- UX inconsistente.
- Complejidad innecesaria.

---

## 🟢 Bajo

Mejoras recomendadas.

Ejemplos:

- Limpieza de código.
- Refactorización menor.
- Consistencia visual.

---

# Resultado Final

## Veredicto

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

---

## Resumen Ejecutivo

Breve evaluación del estado general de la aplicación.

---

## Hallazgos

### 🔴 Críticos

Lista.

### 🟠 Altos

Lista.

### 🟡 Medios

Lista.

### 🟢 Bajos

Lista.

---

## Acciones Requeridas

Lista priorizada de correcciones obligatorias antes de aprobar la siguiente versión.

---

# Regla Final WIKA

La misión de la Auditoría 2 es garantizar que la aplicación funciona correctamente, cumple los requerimientos definidos y no repite errores previamente aprendidos por la plataforma.

Toda V2 debe demostrar una mejora objetiva respecto a la auditoría anterior.

Ningún hallazgo relevante puede quedar únicamente documentado en un review. Debe transformarse en conocimiento reutilizable para fortalecer la plataforma.
