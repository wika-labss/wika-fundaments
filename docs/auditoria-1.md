# Auditoría 1 - Documentación y Estructura

## Objetivo

Validar que la documentación, arquitectura y estructura del proyecto contienen toda la información necesaria para generar una aplicación compilable y capaz de producir un APK Release instalable en un dispositivo físico.

Esta auditoría ocurre antes de generar código.

Su propósito es detectar vacíos de definición, inconsistencias técnicas y riesgos de compilación que puedan provocar fallos durante el desarrollo.

---

## Principio

Un proyecto no puede entrar en generación de código si no supera esta auditoría.

El objetivo de la Auditoría 1 es asegurar:

- Generación correcta de código.
- Compilación exitosa.
- Build reproducible.
- Generación de APK Release.
- Instalación en dispositivo físico.

La Auditoría 1 no revisa código.

---

# Criterio de aprobación

Resultado posible:

```text
APROBADO
```

o

```text
RECHAZADO
```

Si el proyecto es rechazado:

```text
No se genera código.
```

Primero deben corregirse los hallazgos encontrados.

---

# 1. Revisión de Requerimientos

## Validaciones obligatorias

### Objetivo del producto

- [ ] El objetivo está claramente definido.
- [ ] El alcance está claramente definido.
- [ ] Los criterios de aceptación existen.
- [ ] El entregable final está definido.

### Alcance

- [ ] Se identifican funcionalidades incluidas.
- [ ] Se identifican funcionalidades excluidas.
- [ ] No existen ambigüedades funcionales.

### Plataforma objetivo

- [ ] Android.
- [ ] iOS.
- [ ] Web.
- [ ] Desktop.

La plataforma debe estar definida explícitamente.

---

# 2. Revisión de Arquitectura

## Stack tecnológico

Debe existir una definición explícita de:

- [ ] Framework principal.
- [ ] Lenguaje.
- [ ] Gestión de estado.
- [ ] Persistencia.
- [ ] Backend (si aplica).
- [ ] Integraciones externas.

Ejemplo:

```yaml
framework: Expo
language: TypeScript
state: Zustand
storage: AsyncStorage
backend: none
```

---

## Dependencias especiales

- [ ] Hardware requerido documentado.
- [ ] Permisos requeridos documentados.
- [ ] APIs nativas identificadas.
- [ ] Librerías críticas identificadas.

Ejemplos:

```text
Camera
Flash
Bluetooth
Background Tasks
Location
Push Notifications
```

---

## Restricciones

- [ ] Offline-first definido.
- [ ] Requisitos de rendimiento definidos.
- [ ] Limitaciones conocidas documentadas.
- [ ] Riesgos técnicos documentados.

---

# 3. Revisión de Build

## Objetivo de compilación

Debe existir una definición explícita de:

```text
APK Debug
APK Release
AAB Release
IPA
Docker
```

No se permite usar términos ambiguos como:

```text
Aplicación funcional
Build móvil
App Android
```

Sin especificar el artefacto final.

---

## Pipeline de build

Debe existir documentación de:

- [ ] Instalación de dependencias.
- [ ] Verificación de entorno.
- [ ] Compilación.
- [ ] Generación de artefacto.
- [ ] Instalación en dispositivo.

---

# 4. Revisión de Entorno

## Android

Cuando el proyecto sea Android:

- [ ] Android SDK definido.
- [ ] JDK definido.
- [ ] Kotlin definido.
- [ ] Versión Expo definida.
- [ ] React Native definido.

Ejemplo:

```yaml
expo: 52
kotlin: 1.9.25
jdk: 17
```

---

## Dependencias obligatorias

Cuando corresponda al stack seleccionado.

Ejemplo Expo:

- [ ] expo-build-properties
- [ ] expo-asset

Debe existir un manifiesto de dependencias.

---

# 5. Revisión de Templates

- [ ] 01-problem.md completo.
- [ ] 02-features.md completo.
- [ ] 03-module-discovery.md completo.
- [ ] 04-application-design.md completo.
- [ ] 05-build-plan.md completo.

---

# 6. Revisión de Entregable

Debe responderse explícitamente:

## ¿Qué se instalará en el teléfono?

Ejemplo válido:

```text
APK Release autónomo.
```

Ejemplo inválido:

```text
Aplicación Expo funcional.
```

---

## ¿Cómo se validará?

Debe existir un procedimiento de validación física.

Ejemplo:

- Instalar APK.
- Abrir aplicación.
- Ejecutar flujo principal.
- Validar comportamiento esperado.

---

# 7. Gates obligatorios

La documentación debe demostrar que el proyecto podrá ejecutar:

```bash
npx tsc --noEmit

npx expo-doctor

npx expo prebuild --platform android

./gradlew assembleRelease
```

Si alguno de estos pasos no está documentado:

```text
RECHAZAR AUDITORÍA
```

---

# Hallazgos

## Críticos

Problemas que impiden generar código.

Ejemplos:

- Entregable no definido.
- Kotlin no definido.
- Build Release no definido.
- Hardware requerido no identificado.

---

## Altos

Problemas que probablemente generarán errores de compilación.

Ejemplos:

- Dependencias incompletas.
- Pipeline de build incompleto.
- Falta de documentación técnica.

---

## Medios

Problemas que afectan mantenimiento o claridad.

Ejemplos:

- Ambigüedad en arquitectura.
- Riesgos no documentados.

---

# Resultado

## Estado

```text
APROBADO
```

o

```text
RECHAZADO
```

## Resumen ejecutivo

Breve explicación del resultado.

## Hallazgos

Lista priorizada:

- Críticos
- Altos
- Medios

## Acciones requeridas

Lista de correcciones necesarias antes de generar código.

---

# Regla WIKA

Ningún proyecto podrá avanzar a generación de código hasta aprobar la Auditoría 1.

La misión de esta auditoría es asegurar que la información entregada a la IA es suficiente para producir una aplicación compilable, capaz de generar un APK Release instalable y verificable en un dispositivo físico.
