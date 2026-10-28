import type { CSSProperties, ReactNode } from "react";
import { theme } from "../theme";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({ label, onClick, variant = "primary", icon, fullWidth }: ButtonProps) {
  const palette: Record<NonNullable<ButtonProps["variant"]>, CSSProperties> = {
    primary: { background: theme.colors.accent, color: theme.colors.accentText, border: "none" },
    secondary: {
      background: theme.colors.surface,
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`,
    },
    danger: { background: theme.colors.error, color: theme.colors.accentText, border: "none" },
  };
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...palette[variant],
        minHeight: theme.touchTarget,
        maxWidth: theme.ctaMaxWidth,
        width: fullWidth ? "100%" : undefined,
        padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
        borderRadius: theme.radius.md,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.spacing.sm,
        cursor: "pointer",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
