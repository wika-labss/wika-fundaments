# Estándares de Código WIKA

Estándares técnicos obligatorios para proyectos generados bajo el marco WIKA.

Referencia canónica de principios: WIKA-ARCH-01 a WIKA-ARCH-06.

---

## Principios WIKA-ARCH

| ID | Principio | Regla operativa |
|----|-----------|-----------------|
| WIKA-ARCH-01 | La documentación es contrato de build | No generar código sin docs oficiales aprobadas en `idea/` |
| WIKA-ARCH-02 | Versiones pinneadas | Usar `~` en `expo`, `react-native` y dependencias nativas; prohibido `^` |
| WIKA-ARCH-03 | Perfil DEV vs BUILD | Documentar y respetar perfil por iteración (`expo start` vs APK release) |
| WIKA-ARCH-04 | Toolchain nativo documentado | JDK 17, Kotlin 1.9.25, minSdk 24 — declarar en build plan |
| WIKA-ARCH-05 | Gates de verificación | Ejecutar `verify-build` antes de cerrar iteración |
| WIKA-ARCH-06 | Starter validado | Preferir iteración WIKA existente sobre infra greenfield |

---

## Stack móvil estándar (V1)

| Capa | Tecnología |
|------|------------|
| Framework | Expo SDK 52 + React Native 0.76.x |
| Lenguaje | TypeScript |
| Routing | expo-router |
| Estado | Zustand (si aplica) |
| Persistencia | AsyncStorage (si aplica) |
| Target V1 | Android, APK release sin Metro |
| Package ID | `com.wika.<proyecto>` |

## Stack web (páginas / e-commerce)

Cuando `05-build-plan.md` declara sitio web (no APK):

| Capa | Tecnología |
|------|------------|
| Framework | Next.js App Router + TypeScript |
| Persistencia | Supabase (Postgres + Storage) |
| Estilos | Tokens documentados en `04-application-design.md` |
| Engine | `src/engine/` sin imports de React |
| Target V1 | Build web (`npm run build`) |

Versiones pinneadas con `~`. Pagos u otras pasarelas solo si el build plan las incluye; de lo contrario quedan como `pending_integration`.

---

## Estructura de código por iteración

```text
iterations/vN/
├── app/                 # Pantallas (expo-router)
├── src/
│   ├── engine/          # Lógica pura — sin imports de React
│   ├── modules/         # Capacidades reutilizables
│   ├── components/      # UI compartida
│   ├── constants/       # theme.ts — consume tokens
│   └── design-system/   # Tokens sincronizados (si aplica)
├── scripts/
│   ├── verify-build.sh
│   └── build-apk.sh
└── package.json
```

---

## Reglas de módulos

- Un módulo = una responsabilidad principal.
- `src/engine/` y módulos de lógica **no** importan componentes visuales.
- Prohibidas dependencias circulares entre módulos.
- Nombres de módulos en kebab-case: `wave-system`, `offline-progress`.

---

## Reglas de estilo y tokens

- Colores, spacing y tipografía provienen de `standards/design-system.md` o tokens sincronizados desde `design-system/`.
- Prohibido hex hardcoded en componentes cuando existe token equivalente.
- Theme local permitido en V1 solo si está documentado en `04-application-design.md` y mapeado en RTM.
- Profesionalización visual completa (component kits, assets PNG) sigue el pipeline `design-system/` en **V3+**.

---

## Librerías y prácticas prohibidas

| Prohibido | Motivo |
|-----------|--------|
| `^` en expo/react-native | WIKA-ARCH-02 |
| Estilos inline con valores mágicos | Sin trazabilidad a tokens |
| Lógica de negocio dentro de pantallas `app/` | Violación de separación engine/modules |
| Imports cruzados UI ↔ engine | Acoplamiento no permitido |
| Generar infra desde cero ignorando starter WIKA | WIKA-ARCH-06 |

---

## Verificación obligatoria

Antes de marcar una iteración como completa:

```bash
npm run typecheck
npm run verify
```

Incluye smoke tests de engine, export, prebuild y APK release cuando aplique.
