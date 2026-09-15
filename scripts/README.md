# Scripts

Herramientas de gobierno de `wika-fundaments`. Este repositorio no contiene código de negocio; estos scripts solo validan la consistencia de la documentación oficial.

## Validación documental

```bash
python3 scripts/validate_docs.py
python3 -m unittest tests.test_validate_docs
```

Detecta:

- Archivos de auditoría obligatorios ausentes
- Referencias a nombres de auditoría pre-v2.1
- Ruta de proyecto distinta de `proyectos/app/`
- Conteo incorrecto de etapas del pipeline design-system (vigente: 12)
- Stack móvil distinto de Expo/RN como default V1
- Enlaces Markdown locales rotos
- Bloques de código sin cerrar
- Catálogo `agents/`: fichas listadas, `future_skill`, `hands_off_to` y ruta canónica
