# AI Generation Prompt

# Metadata

| Campo | Valor |
|---------|---------|
| Proyecto | Sudoku Adulto |
| Autor | WIKA / Negocio |
| Fecha | 2026-08-12 |
| Estado | Draft |
| Versión | 1.0 |

---

# Objetivo

Definir instrucciones adicionales para el agente IA encargado de generar la solución.

Este documento complementa la documentación del proyecto y permite ajustar prioridades, restricciones y comportamiento durante la generación.

No debe duplicar información existente en:

```text
01-problem.md
02-features.md
03-architecture.md
04-design.md
```

---

# Contexto

La generación deberá basarse obligatoriamente en:

```text
01-problem.md
02-features.md
03-architecture.md
04-design.md
06-build-environment.md
```

Estos documentos representan la fuente oficial de verdad del proyecto.

La generación solo está permitida después de Auditoría 1 = APROBADO.

---

# Prioridades de Generación

1. **Jugabilidad correcta**: generación válida, reglas de sudoku, victoria real.
2. **Simplicidad**: pocas pantallas, cero backend, cero auth.
3. **Build Release**: APK Release instalable es criterio de éxito, no opcional.
4. **Experiencia adulta**: UI sobria; el tablero manda.
5. **Offline y persistencia**: continuar partida sin fricción.

---

# Restricciones Adicionales

- No agregar anuncios, analytics, compras ni login “por si acaso”.
- No implementar variantes de sudoku fuera de 9×9 clásico.
- No introducir dependencias nativas innecesarias.
- No usar placeholders de tablero: debe generarse un puzzle real.
- Separar motor de sudoku (puro TypeScript) de la capa UI.
- Mantener el código listo para `tsc --noEmit` sin errores.
- Respetar versiones de `06-build-environment.md`.

---

# Alcance de la Generación

- [ ] Prototipo visual
- [ ] Aplicación funcional mínima
- [x] Aplicación lista para revisión
- [ ] Aplicación lista para demostración
- [ ] Aplicación lista para producción

Comentarios: V1 debe ser jugable de punta a punta y compilable a APK Release para Auditoría 2.

---

# Entregables Esperados

- [x] Código fuente
- [x] APK
- [x] Documentación técnica
- [x] Instrucciones de instalación
- [x] Reporte de generación

Ubicación esperada:

```text
applications/sudoku-adulto/iterations/v1/
├── source/
├── documentation/
├── apk/
└── generation-report.md
```

Artefacto APK:

```text
APK Release autónomo
```

---

# Consideraciones para el Arquitecto

- Validar que los tableros tienen solución única.
- Verificar persistencia al matar el proceso de la app.
- Confirmar ausencia de permisos sensibles en el manifiesto.
- Instalar APK Release en dispositivo físico y completar una partida.
- Revisar que el diseño no derive a estética infantil, púrpura genérica o dashboard sobrecargado.
- Ejecutar gates de build documentados.

---

# Observaciones

- Nombre comercial: **Sudoku Adulto**.
- Copy en español.
- Si hay trade-offs, priorizar motor correcto + APK Release sobre animaciones o extras deseables.
- Funcionalidades deseables solo si no arriesgan el build ni el alcance V1.

---

# Resultado Esperado

Al finalizar este documento cualquier agente IA debe ser capaz de responder:

1. ¿Qué debe generar?
2. ¿Qué prioridad debe seguir?
3. ¿Qué restricciones adicionales existen?
4. ¿Qué entregables debe producir?
5. ¿Qué debe validar posteriormente el arquitecto?
