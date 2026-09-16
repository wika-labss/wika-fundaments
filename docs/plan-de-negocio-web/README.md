# Plan de negocio web — índice

Tesis comercial (humanos) y contrato operativo (agentes / gates). **Una plataforma, muchas instancias.** SKU solo `A` o `B`. No hay tercer modelo (`portfolio` no es SKU: si no cabe, es no-go).

| Capa | Archivo | Para qué |
|------|---------|----------|
| Tesis | [plan-de-negocio.md](plan-de-negocio.md) | Modelos A/B, infra, costos, proyección |
| Contrato | [`standards/sku-contract.yaml`](../../standards/sku-contract.yaml) | SKU, stack, `forbidden_v1`, kill switches |
| Instancia | [`templates/05-build-plan.md`](../../templates/05-build-plan.md) | Hoja de ruta, dependencias y stack del tenant |

Clasificación en Gate 1: `sku` en `01-problem.md` y `02-features.md` (deben coincidir). Construcción y release se validan contra el contrato, no contra un stack inventado por el proyecto.
