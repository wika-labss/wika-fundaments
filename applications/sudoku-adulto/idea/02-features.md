# Features

# Metadata

| Campo | Valor |
|---------|---------|
| Proyecto | Sudoku Adulto |
| Autor | WIKA / Negocio |
| Fecha | 2026-08-12 |
| Estado | Draft |

---

# Resumen

Aplicación Android de sudoku 9×9 para adultos: elegir dificultad, jugar offline, usar notas, deshacer jugadas, detectar victoria y conservar progreso local.

---

# Funcionalidades Obligatorias

## F1. Inicio y selección de dificultad

Pantalla inicial con acceso a:

- Nueva partida (Fácil / Medio / Difícil / Experto).
- Continuar partida si existe una guardada.
- Ver estadísticas básicas.

---

## F2. Generación de tablero válido

- Generar un sudoku 9×9 con solución única.
- Remover celdas según dificultad seleccionada.
- Garantizar que el tablero sea resoluble.

---

## F3. Tablero interactivo

- Selección de celda.
- Ingreso de dígitos 1–9.
- Celdas fijas (pistas) no editables.
- Resaltado de fila, columna y bloque 3×3 de la celda activa.
- Resaltado opcional de mismo número.

---

## F4. Notas / candidatos

- Modo notas para marcar candidatos en una celda.
- Alternar entre modo valor y modo notas.
- Las notas se limpian al ingresar un valor definitivo.

---

## F5. Ayudas de juego mínimas

- Deshacer última acción.
- Borrar contenido de celda editable.
- Indicador de celdas en conflicto (valor duplicado inválido).
- Contador de errores (límite configurable; default 3 en modo estricto, o sin límite en modo libre — V1 usa contador visible sin game-over forzado).

---

## F6. Temporizador y estado de partida

- Cronómetro visible durante la partida.
- Pausar / reanudar.
- Al completar el tablero correctamente: pantalla de victoria con tiempo y dificultad.

---

## F7. Persistencia local

- Guardar automáticamente la partida en curso.
- Reanudar partida al reabrir la app.
- Guardar estadísticas locales:
  - Partidas completadas por dificultad.
  - Mejor tiempo por dificultad.
  - Total de partidas iniciadas.

---

## F8. Experiencia adulta sin distracciones

- Sin anuncios.
- Sin recompensas tipo “vidas” o monedas.
- Sin onboarding largo; máximo una pantalla opcional de tip breve.

---

# Funcionalidades Deseables

- Pista (revelar una celda) con límite por partida.
- Modo “solo conflictos” vs “validación contra solución”.
- Tema claro / oscuro.
- Vibración suave al error (opcional, desactivable).
- Exportar/compartir resultado (texto o imagen).

---

# Reglas de Negocio

- Un tablero siempre debe tener solución única.
- Las celdas pista no pueden modificarse.
- No se permite un valor que rompa reglas clásicas de sudoku en fila, columna o bloque (conflicto visual inmediato).
- Solo puede existir una partida en curso a la vez; iniciar otra pide confirmación y reemplaza la anterior.
- Estadísticas solo locales; no se envían a ningún servidor.
- Offline completo: ninguna función obligatoria requiere red.

---

# Fuera de Alcance

- Cuentas, login o nube.
- Multijugador, ligas o rankings.
- Publicidad, IAP o suscripciones.
- Variantes no clásicas.
- iOS / Web como plataformas de entrega V1.
- Backend.

---

# Resultado Esperado

Al finalizar este documento cualquier persona o agente IA debe poder responder:

1. ¿Qué debe hacer la aplicación?
2. ¿Qué funcionalidades son obligatorias?
3. ¿Qué funcionalidades son opcionales?
4. ¿Qué queda fuera de esta versión?
