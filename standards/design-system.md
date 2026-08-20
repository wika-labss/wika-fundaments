# Estándares de Diseño WIKA

Reglas visuales mínimas para documentación pre-build (V1) y referencia para agentes IA.

Para profesionalización completa (V3+), usar el repositorio `design-system/` y su **pipeline de 12 etapas (v2)** — ver [`design-system/Design System.md`](../../design-system/Design%20System.md).

---

## Dos niveles de diseño

| Nivel | Cuándo | Fuente |
|-------|--------|--------|
| **Base V1** | Pre-build y construcción V1 | Este documento + `04-application-design.md` |
| **Profesional V3+** | App funcionalmente madura | Repo `design-system/` (pipeline 12 etapas v2: tokens, kits, implementación en v{N+1}, Gate 2) |

---

## Formato de tokens (wika-tokens/v1)

Los tokens aprobados viven en JSON con schema:

```json
{
  "$schema": "wika-tokens/v1",
  "family": "[nombre-familia]",
  "status": "approved",
  "colors": {
    "background": { "value": "#FFFFFF", "description": "Fondo principal" }
  }
}
```

En código React Native, consumir vía `src/constants/theme.ts` o `src/design-system/tokens/` — nunca duplicar hex en componentes.

---

## Tokens semánticos base (placeholder V1)

Usar estos nombres en plantillas y theme local hasta sincronizar familia aprobada:

| Token | Uso | Ejemplo RN |
|-------|-----|------------|
| `background` | Fondo de app/pantalla | `theme.colors.background` |
| `surface` | Paneles, cards | `theme.colors.surface` |
| `text` | Texto principal | `theme.colors.text` |
| `text-muted` | Texto secundario | `theme.colors.textMuted` |
| `accent` | Acción primaria | `theme.colors.accent` |
| `error` | Errores, conflictos | `theme.colors.error` |
| `border` | Bordes | `theme.colors.border` |

### Spacing

| Token | Valor dp | Uso |
|-------|----------|-----|
| `xs` | 4 | Separación mínima |
| `sm` | 8 | Padding interno compacto |
| `md` | 16 | Padding estándar |
| `lg` | 24 | Secciones |
| `xl` | 32 | Márgenes amplios |

### Tipografía

| Token | Uso |
|-------|-----|
| `fontFamily.base` | System (RN default) |
| `fontSize.sm` | 12–14 |
| `fontSize.md` | 16 |
| `fontSize.lg` | 20–24 |
| `fontWeight.regular` | 400 |
| `fontWeight.bold` | 700 |

### Radius y touch

| Regla | Valor |
|-------|-------|
| `radius.sm` | 4–8 dp |
| `radius.md` | 12–16 dp |
| Touch target mínimo | 44 dp (WIKA mobile) |
| CTA max-width | 340 dp |

---

## Reglas de UI

1. **Mobile-first Android** en V1.
2. **Sin texto baked** en assets PNG (labels vía props).
3. **Dual Layer UI** (cuando aplique): acciones con kit PNG; contenido con tokens planos.
4. **Preview antes de código**: layout aprobado en `04-application-design.md` con `visual_approval_passed: true`.
5. **Sincronización V3+**: copiar tokens desde `design-system/tokens/{familia}/` al proyecto; registrar `approvalRef`.

---

## Referencias cruzadas

- Familia aprobada ejemplo: `design-system/tokens/cute-pink/`
- Schema y reglas: `design-system/tokens/README.md`
- Aprobación visual formal: `design-system/visual-expectation/{proyecto}-v{N}/approval.md`
