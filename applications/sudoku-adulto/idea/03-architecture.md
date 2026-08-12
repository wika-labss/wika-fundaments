# Architecture

# Metadata

| Campo | Valor |
|---------|---------|
| Proyecto | Sudoku Adulto |
| Autor | WIKA / Negocio |
| Fecha | 2026-08-12 |
| Estado | Draft |
| Versión | 1.0 |
| Tipo de Proyecto | Simple |

---

# Objetivo

Definir las decisiones técnicas y restricciones arquitectónicas que deberá respetar la solución.

Este documento no describe una implementación detallada.

Su propósito es proporcionar a los agentes IA y arquitectos una guía técnica clara antes de iniciar la generación.

---

# Nivel de Complejidad

- [x] Simple
- [ ] Intermedio
- [ ] Avanzado

Justificación: app cliente única, sin backend, dominio acotado (sudoku + persistencia local).

---

# Plataforma

- [x] Android
- [ ] iOS
- [ ] Web
- [ ] Backend
- [ ] Escritorio
- [ ] Otra

Plataforma objetivo V1: **Android**.

Entregable: **APK Release** autónomo instalable en dispositivo físico.

---

# Tecnologías Requeridas

## Frontend

```yaml
framework: Expo
expo_sdk: 52
language: TypeScript
ui: React Native
navigation: Expo Router (o React Navigation)
state: Zustand
storage: AsyncStorage
```

## Backend

```text
none
```

## Base de Datos

```text
Persistencia local mediante AsyncStorage (o equivalente aprobado en Expo).
Sin base de datos remota.
```

## Stack explícito (Auditoría 1)

```yaml
framework: Expo
language: TypeScript
state: Zustand
storage: AsyncStorage
backend: none
```

---

# Integraciones

No hay integraciones externas obligatorias.

## Integración 1

Nombre: Ninguna

Descripción: La aplicación es autónoma.

Propósito: Evitar dependencia de red, cuentas o SDKs de analytics/ads.

---

# Autenticación

- [x] No requiere autenticación
- [ ] Email y contraseña
- [ ] Google
- [ ] Microsoft
- [ ] Active Directory
- [ ] Otra

Comentarios adicionales: Todo el progreso es local al dispositivo.

---

# Almacenamiento

Sí. Se almacena en el dispositivo:

- Partida en curso (tablero, notas, tiempo, dificultad, historial de undo).
- Estadísticas agregadas.

No se almacenan credenciales ni datos personales sensibles.

---

# Modo Offline

- [ ] No requerido
- [ ] Deseable
- [x] Obligatorio

Comentarios: 100% de las funciones obligatorias deben operar sin conectividad.

---

# Seguridad

- No recolectar datos personales.
- No incluir SDKs de publicidad ni tracking.
- No exponer secretos (no aplica backend).
- Validar integridad lógica del tablero en cliente.

---

# Restricciones Técnicas

- Android 10 (API 29) o superior.
- Orientación principal: portrait.
- Debe compilar APK Release con Gradle (`assembleRelease`).
- Debe pasar gates documentados en `06-build-environment.md`:
  - `npx tsc --noEmit`
  - `npx expo-doctor`
  - `npx expo prebuild --platform android`
  - `./gradlew assembleRelease`
- Evitar dependencias nativas no esenciales (cámara, ubicación, bluetooth, etc.).
- Generación de sudoku debe ejecutarse en cliente con rendimiento aceptable (< 2s en dispositivo medio para generar tablero).

---

# Decisiones Arquitectónicas

```text
1. Expo + TypeScript para alineación con gates de Auditoría 1 WIKA.
2. Sin backend para maximizar simplicidad y offline.
3. Zustand para estado de juego reactivo y predecible.
4. AsyncStorage para persistencia mínima viable.
5. Lógica de sudoku aislada en módulo puro TypeScript (generación, validación, solución) separable de la UI.
6. APK Release como único artefacto de entrega V1.
```

---

# Dependencias especiales

## Hardware

```text
Ninguno especial. Solo pantalla táctil.
```

## Permisos

```text
Ningún permiso sensible requerido.
```

## APIs nativas

```text
Ninguna crítica (sin cámara, GPS, bluetooth, push).
```

## Librerías críticas

```text
expo
react-native
typescript
zustand
@react-native-async-storage/async-storage
expo-build-properties
expo-asset
```

---

# Riesgos técnicos

| Riesgo | Mitigación |
|--------|------------|
| Generación lenta de tableros difíciles | Algoritmo con backtracking + límite de tiempo; precomputar seeds si es necesario |
| Persistencia corrupta | Versionar schema local y reset seguro |
| APK Release falla en prebuild | Documentar versiones exactas en 06-build-environment.md |

---

# Información Adicional

Referencias WIKA:

- `workflows/application-lifecycle.md`
- `docs/Auditoria 1.md`
- `templates/03-architecture.md`

---

# Resultado Esperado

Al finalizar este documento cualquier persona o agente IA debe poder responder:

1. ¿Dónde se ejecutará la solución?
2. ¿Qué tecnologías deben utilizarse?
3. ¿Qué integraciones existen?
4. ¿Qué restricciones técnicas deben respetarse?
5. ¿Qué decisiones arquitectónicas ya fueron tomadas?
