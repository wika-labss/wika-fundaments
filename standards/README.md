# Standards

Estándares técnicos y visuales para sitios web bajo WIKA.

**Ruta canónica de sitios:** `proyectos/web/{proyecto}/`.

Tokens web (`design-system.md`) y coding standards — pendientes (ver ROADMAP). Hasta entonces: dirección visual = matriz + MOD-DIR; producto A/B = `sku-contract.yaml`.

## sku-contract.yaml

Contrato machine-readable del [plan de negocio](../docs/plan-de-negocio-web/plan-de-negocio.md). Cada sitio en `proyectos/web/{proyecto}/` es un **tenant** con `sku: A` o `sku: B`. El stack no se inventa por proyecto.

Índice: [docs/plan-de-negocio-web/README.md](../docs/plan-de-negocio-web/README.md).

## direction-matrix.yaml

Matriz stub **industria / tipo de negocio → `direction_skill`** (taste-skill). Consumida por el módulo `MOD-DIR` en `templates/03-module-discovery.md`.

| Install name | Perfil |
|--------------|--------|
| `minimalist-ui` | B2B SaaS, devtools, trust-first |
| `high-end-visual-design` | Luxury, wellness, premium DTC |
| `industrial-brutalist-ui` | Agencia experimental, editorial crudo |

Tokens web y coding standards — pendiente de redacción.
