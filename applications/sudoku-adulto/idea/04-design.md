# Design

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

Definir la experiencia de usuario y la apariencia esperada de la solución.

Este documento proporciona a los agentes IA una referencia visual y funcional sobre cómo debería verse y utilizarse la aplicación.

---

# Resumen de Experiencia

Aplicación calmada, sobria y adulta. El tablero es el protagonista. Tipografía clara, contraste alto, sin gamificación infantil, sin badges flotantes ni recompensas ruidosas. Se siente como un buen set de lápiz y papel digital.

---

# Pantallas Principales

## Pantalla 1

### Nombre

```text
Inicio
```

### Objetivo

Entrar rápido a jugar o continuar.

### Elementos

- Marca / nombre: **Sudoku Adulto** (hero de pantalla, no solo en nav).
- CTA principal: Continuar partida (si existe).
- CTA secundaria: Nueva partida.
- Selector de dificultad (Fácil, Medio, Difícil, Experto).
- Acceso a Estadísticas.
- Sin banners, chips promocionales ni contadores de rachas.

---

## Pantalla 2

### Nombre

```text
Juego
```

### Objetivo

Resolver el sudoku con mínima fricción.

### Elementos

- Tablero 9×9 a ancho completo (plano visual dominante).
- Cronómetro discreto.
- Dificultad actual (texto secundario).
- Teclado numérico 1–9.
- Controles: Notas, Borrar, Deshacer, Pausar.
- Resaltado de región activa y conflictos.
- No overlays decorativos sobre el tablero.

---

## Pantalla 3

### Nombre

```text
Pausa
```

### Objetivo

Interrumpir sin perder contexto.

### Elementos

- Mensaje breve “Partida en pausa”.
- Reanudar.
- Abandonar / volver al inicio (con confirmación).

---

## Pantalla 4

### Nombre

```text
Resultado
```

### Objetivo

Cerrar la partida con claridad.

### Elementos

- “Sudoku resuelto”.
- Tiempo final y dificultad.
- Nueva partida.
- Volver al inicio.

---

## Pantalla 5

### Nombre

```text
Estadísticas
```

### Objetivo

Ver progreso local.

### Elementos

- Completadas por dificultad.
- Mejor tiempo por dificultad.
- Partidas iniciadas.
- Sin gráficos complejos; lista clara.

---

# Flujo de Navegación

```text
Inicio
↓
Nueva partida (elige dificultad)  o  Continuar
↓
Juego
↓
Pausa (opcional) → Reanudar → Juego
↓
Tablero completo
↓
Resultado
↓
Inicio / Nueva partida
```

Flujo alterno:

```text
Inicio → Estadísticas → Inicio
```

---

# Referencias Visuales

Aplicaciones de referencia (solo tono, no copiar UI):

- Sudoku.com (claridad de tablero) — evitar su capa de ads/gamificación.
- Apps de crucigramas adultas: tipografía serena, márgenes generosos.
- Sensación: papel crema suave + tinta oscura, o modo noche grafito; no “candy colors”.

---

# Estilo Visual

- Minimalista adulto.
- Enfocado en lectura y precisión táctil.
- Un solo plano visual por pantalla; el juego no es un dashboard.
- Sin cards innecesarias en hero/inicio: acciones directas.
- Sin pills decorativas ni icon rows de features.

Comentarios: Priorizar legibilidad del tablero sobre ornamentación.

---

# Colores y Marca

```text
Nombre de marca: Sudoku Adulto

Dirección visual:
- Fondo atmósfera: degradado sutil tinta/grafito o papel cálido profundo (evitar crema genérica #F4F1EA + terracota, evitar púrpura/índigo).
- Acento: verde bosque o azul pizarra (elegir uno y mantenerlo).
- Texto principal: casi negro / off-white según tema.
- Conflictos: rojo sobrio, no neón.
- Pistas: tinta secundaria; editables: contraste claro.

Tipografía:
- Display/marca: serif o humanista expresiva (no Inter/Roboto/Arial/system).
- Tablero/números: tabular sans de alta legibilidad.

El agente puede proponer tokens concretos respetando esta dirección.
```

---

# Experiencia de Usuario

- Máximo 1–2 toques desde inicio hasta jugar.
- Botones del teclado numérico grandes (uso con una mano).
- Feedback inmediato en conflictos.
- Animaciones sutiles (2–3): aparición del tablero, transición a victoria, resaltado breve de celda.
- Sin onboarding obligatorio.

---

# Consideraciones Especiales

- Público adulto: tono serio, copy breve, sin emojis.
- El nombre **Sudoku Adulto** debe ser señal hero en la primera pantalla.
- Tablero full-bleed dentro del área de juego (edge-to-edge del contenido útil), no tarjeta flotante con sombra múltiple.
- Soporte de accesibilidad básica: áreas táctiles grandes, contraste AA cuando sea posible.

---

# Material Adjuntado

```text
(ninguno aún)
```

---

# Resultado Esperado

Al finalizar este documento cualquier persona o agente IA debe poder responder:

1. ¿Qué pantallas tendrá la aplicación?
2. ¿Cómo navegará el usuario?
3. ¿Qué experiencia se busca entregar?
4. ¿Qué referencias visuales existen?
5. ¿Qué restricciones de diseño deben respetarse?
6. ¿Qué estilo visual se espera?
