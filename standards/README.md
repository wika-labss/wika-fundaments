
# Standards

Contiene los estándares técnicos y funcionales de WIKA.

Estos estándares definen cómo deben construirse las soluciones para asegurar calidad, mantenibilidad y consistencia.

Todos los proyectos deben respetar los estándares definidos en esta carpeta.

## Documentos

| Archivo | Contenido |
|---------|-----------|
| `coding-standards.md` | WIKA-ARCH-01–06, stack Expo/RN, estructura de código, librerías prohibidas |
| `design-system.md` | Tokens base V1, reglas UI mobile, referencia al repo `design-system/` para V3+ |
| `coding-standards-web.md` | Stack y verify web V1 |
| `solution-types.md` | Taxonomía mobile / game / web / hybrid |

## Relación con design-system

- **V1 (pre-build):** usar tokens semánticos y theme local documentado en `04-application-design.md`.
- **V3+ (madurez funcional):** pipeline completo en repositorio `design-system/` (auditorías UI, tokens JSON `wika-tokens/v1`, component kits).
