# Prototipo móvil (WIKA)

Iteración `prototype/` creada por WIKA Studio a partir de `templates/expo-prototype`
(Expo SDK 52, React Native 0.76, expo-router, TypeScript).

- Alcance: demo navegable para iterar con el cliente en el simulador de dispositivo de Studio. No es release.
- Reglas: tokens en `src/theme.ts` (sin hex sueltos en pantallas); lógica pura en `src/engine/` sin React; pantallas en `app/` (expo-router).
- Scripts (contrato `iteration-environment-spec.md`): `npm run dev` (Expo web, imprime `PREVIEW_URL=`), `npm run verify`, `npm run build:artifact`.
- Metro de SDK 52 exige `expo-asset` (incluido en esta plantilla). Sin él, `expo start --web` sale con `code=1`.
- Celular real: `WIKA_EXPO_TUNNEL=1 npm run dev` y escanear el QR con Expo Go.
- Imágenes del cliente: `assets/`.
