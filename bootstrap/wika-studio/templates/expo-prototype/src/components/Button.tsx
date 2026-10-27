import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "@/theme";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger";
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({ label, onPress, variant = "primary", icon, fullWidth }: ButtonProps) {
  const isFilled = variant !== "secondary";
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "danger" && styles.danger,
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
      ]}
    >
      {icon}
      <Text style={[styles.label, isFilled ? styles.labelOnFill : styles.labelOnSurface]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: theme.touchTarget,
    maxWidth: theme.ctaMaxWidth,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  primary: { backgroundColor: theme.colors.accent },
  secondary: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  danger: { backgroundColor: theme.colors.error },
  fullWidth: { alignSelf: "stretch" },
  pressed: { opacity: 0.85 },
  label: { fontSize: theme.fontSize.md, fontWeight: "700" },
  labelOnFill: { color: theme.colors.accentText },
  labelOnSurface: { color: theme.colors.text },
});
