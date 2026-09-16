# Scripts

Herramientas de gobierno de `web-design`. Este repositorio no contiene sitios de cliente; estos scripts validan la consistencia de la documentación oficial.

## Validación documental

```bash
python3 scripts/validate_docs.py
python3 -m unittest tests.test_validate_docs
```

Detecta:

- Archivos de auditoría obligatorios ausentes
- Ruta de proyecto distinta de `proyectos/web/`
- Plantilla `05-build-plan.md` ausente o 04 con `ready_for_construction`
- Contrato `sku-contract.yaml` sin SKU A/B o `forbidden_v1`
- Flag `audit_2_passed` fuera de la plantilla 03
- `.cursorrules` sin gates / contrato Fase 1–2
- `PUSH.md` con bootstrap obsoleto desde `wika-fundaments`
- Matriz de dirección sin skills canónicos
- Enlaces Markdown locales rotos
- Bloques de código sin cerrar
