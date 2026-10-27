/**
 * Tokens semánticos base V1 (wika-fundaments standards/design-system.md).
 * Regla WIKA: prohibido hex suelto en pantallas cuando existe token equivalente.
 */
export const theme = {
  colors: {
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#64748B",
    accent: "#2563EB",
    accentText: "#FFFFFF",
    error: "#DC2626",
    success: "#16A34A",
    border: "#E2E8F0",
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  fontSize: { sm: 14, md: 16, lg: 22, xl: 28 },
  fontWeight: { regular: 400, bold: 700 },
  radius: { sm: 8, md: 14, pill: 999 },
  touchTarget: 44,
  ctaMaxWidth: 340,
} as const;

export type Theme = typeof theme;
