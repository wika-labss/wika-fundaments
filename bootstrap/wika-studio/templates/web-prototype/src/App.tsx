import { useState } from "react";
import { Button } from "./components/Button";
import { createCounter, decrement, increment } from "./engine";
import { theme } from "./theme";

/**
 * Pantalla inicial del prototipo. Los agentes WIKA (wika-builder) la
 * reemplazan o amplían según la solución descrita por el cliente.
 */
export function App() {
  const [counter, setCounter] = useState(createCounter());

  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        color: theme.colors.text,
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing.lg,
        gap: theme.spacing.lg,
        boxSizing: "border-box",
      }}
    >
      <header style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: theme.fontSize.xl, margin: 0 }}>Prototipo WIKA</h1>
        <p style={{ color: theme.colors.textMuted, marginTop: theme.spacing.xs }}>
          Describe la solución en el chat y mira el resultado aquí.
        </p>
      </header>

      <section
        style={{
          background: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.md,
          padding: theme.spacing.lg,
          width: "100%",
          maxWidth: theme.ctaMaxWidth,
          textAlign: "center",
          display: "grid",
          gap: theme.spacing.md,
        }}
      >
        <span style={{ fontSize: 48, fontWeight: theme.fontWeight.bold }}>{counter.value}</span>
        <div style={{ display: "flex", gap: theme.spacing.sm, justifyContent: "center" }}>
          <Button label="−" variant="secondary" onClick={() => setCounter((c) => decrement(c))} />
          <Button label="+" onClick={() => setCounter((c) => increment(c))} />
        </div>
        {/* wika:slot */}
      </section>
    </main>
  );
}
