import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { createCounter, decrement, increment } from "@/engine";
import { theme } from "@/theme";

/**
 * Pantalla inicial del prototipo. Los agentes WIKA (wika-builder) la
 * reemplazan o amplían según la solución descrita por el cliente.
 */
export default function HomeScreen() {
  const [counter, setCounter] = useState(createCounter());

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Prototipo WIKA</Text>
        <Text style={styles.subtitle}>Describe la solución en el chat y mira el resultado aquí.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.value}>{counter.value}</Text>
        <View style={styles.row}>
          <Button label="−" variant="secondary" onPress={() => setCounter((c) => decrement(c))} />
          <Button label="+" onPress={() => setCounter((c) => increment(c))} />
        </View>
        {/* wika:slot */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  header: { alignItems: "center" },
  title: { fontSize: theme.fontSize.xl, fontWeight: "700", color: theme.colors.text },
  subtitle: { color: theme.colors.textMuted, marginTop: theme.spacing.xs, textAlign: "center" },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    width: "100%",
    maxWidth: theme.ctaMaxWidth,
    alignItems: "center",
    gap: theme.spacing.md,
  },
  value: { fontSize: 48, fontWeight: "700", color: theme.colors.text },
  row: { flexDirection: "row", gap: theme.spacing.sm },
});
