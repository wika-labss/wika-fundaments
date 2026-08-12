# Build Environment

# Metadata

| Campo | Valor |
|---------|---------|
| Proyecto | Sudoku Adulto |
| Autor | WIKA / Negocio |
| Fecha | 2026-08-12 |
| Estado | Draft |
| Versión | 1.0 |

---

# Objetivo

Definir el entorno de compilación y despliegue requerido por el proyecto para producir un artefacto instalable reproducible.

---

# Entregable Final

Debe generarse explícitamente:

```text
APK Release
```

Descripción:

```text
APK Release autónomo, firmado para release local (keystore de proyecto),
instalable en dispositivo Android físico sin Expo Go.
```

No son entregables V1:

```text
APK Debug (solo apoyo de desarrollo)
AAB (opcional futuro store)
IPA
Docker
Aplicación Web
```

---

# Framework y versiones

```yaml
framework: Expo
expo_sdk: "52"
react_native: compatible con Expo 52
language: TypeScript
node: "20.x"
package_manager: npm
```

## Android / JVM

```yaml
android_min_sdk: 29
android_target_sdk: 34
android_compile_sdk: 34
jdk: 17
kotlin: "1.9.25"
```

## Dependencias críticas

```text
expo
expo-build-properties
expo-asset
typescript
zustand
@react-native-async-storage/async-storage
```

Manifiesto mínimo esperado en `package.json` (nombres; versiones exactas las fija la generación respetando Expo 52).

---

# Estructura de build esperada

```text
source/
├── app/                 # pantallas (Expo Router) o src/screens
├── src/
│   ├── game/            # motor sudoku puro
│   ├── state/           # zustand
│   ├── storage/         # async storage
│   └── theme/
├── android/             # tras prebuild
├── app.json / app.config.ts
├── package.json
└── tsconfig.json
```

---

# Pipeline de build

## 1. Instalación de dependencias

```bash
npm ci
```

o, si no hay lockfile inicial:

```bash
npm install
```

## 2. Verificación de entorno

```bash
node -v
java -version
npx tsc --noEmit
npx expo-doctor
```

## 3. Prebuild Android

```bash
npx expo prebuild --platform android --clean
```

## 4. Compilación Release

```bash
cd android
./gradlew assembleRelease
```

## 5. Artefacto

Ruta esperada:

```text
android/app/build/outputs/apk/release/app-release.apk
```

Copiar a:

```text
applications/sudoku-adulto/iterations/v1/apk/sudoku-adulto-release.apk
```

## 6. Instalación en dispositivo

```bash
adb install -r sudoku-adulto-release.apk
```

---

# Procedimiento de validación física

1. Instalar APK Release con `adb install`.
2. Abrir **Sudoku Adulto**.
3. Iniciar partida en dificultad Media.
4. Ingresar números, usar notas, deshacer y pausar.
5. Forzar cierre de app y reabrir: debe restaurar partida.
6. Completar tablero (o validar victoria con puzzle de prueba controlado).
7. Verificar estadísticas locales actualizadas.
8. Confirmar uso sin red (modo avión).

---

# Firmado Release

- Generar keystore local de proyecto (no commitear secretos).
- Configurar `gradle` signing para `assembleRelease`.
- Documentar alias y ubicación del keystore en documentación de la iteración (sin passwords en git).

---

# Gates obligatorios (Auditoría 1)

La documentación y la generación deben soportar:

```bash
npx tsc --noEmit
npx expo-doctor
npx expo prebuild --platform android
./gradlew assembleRelease
```

Si alguno no puede ejecutarse por falta de definición: **Auditoría 1 = RECHAZADO**.

---

# CI (opcional V1)

No obligatorio para V1. Build local documentado es suficiente para Auditoría 1/2.

---

# Resultado Esperado

Cualquier agente o arquitecto debe poder responder:

1. ¿Qué artefacto se entrega? → APK Release
2. ¿Qué SDK/JDK/Kotlin/Expo se usan?
3. ¿Cómo se instalan dependencias?
4. ¿Cómo se compila el release?
5. ¿Cómo se valida en un teléfono físico?
