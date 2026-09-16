#!/usr/bin/env python3
"""Valida consistencia interna de web-design (enlaces, rutas, gates)."""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

STALE_FILENAMES = (
    "auditoria-1.md",
    "auditoria-2.md",
)

# Raíz de producto pre-canónica. Vigente: proyectos/web/{proyecto}/
STALE_PROJECT_PATH_PATTERNS = (
    re.compile(r"applications/proyectos"),
    re.compile(r"applications/<"),
    re.compile(r"applications/\{"),
    re.compile(r"viven en `applications/"),
    re.compile(r"Copiar a `applications/"),
)

ALLOW_STALE_IN = {
    "CHANGELOG.md",
    "docs/bug-fix-report.md",
    "docs/bug-fix-report.json",
    "docs/bug-fix-report.yaml",
    "docs/bug-fix-report.csv",
}

REQUIRED_FILES = (
    "docs/auditoria-documentacion.md",
    "docs/auditoria-modulos.md",
    "docs/auditoria-ensamblado.md",
    "docs/auditoria-release-v1.md",
    "docs/documentation.md",
    "docs/instructivo-nuevos-usuarios.md",
    "docs/plan-de-negocio-web/plan-de-negocio.md",
    "docs/plan-de-negocio-web/README.md",
    "workflows/application-lifecycle.md",
    "templates/01-problem.md",
    "templates/02-features.md",
    "templates/03-module-discovery.md",
    "templates/04-html-design.md",
    "templates/05-build-plan.md",
    "standards/direction-matrix.yaml",
    "standards/sku-contract.yaml",
    "skills/README.md",
    ".cursorrules",
    "agents/README.md",
)

MD_LINK_RE = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
FENCE_RE = re.compile(r"^(`{3,})")
CANONICAL_PATH = "proyectos/web/"
DIRECTION_SKILLS = (
    "minimalist-ui",
    "high-end-visual-design",
    "industrial-brutalist-ui",
)


@dataclass
class Finding:
    path: str
    message: str


@dataclass
class ValidationResult:
    errors: list[Finding] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return not self.errors


def _rel(path: Path, root: Path = REPO_ROOT) -> str:
    try:
        return path.resolve().relative_to(root.resolve()).as_posix()
    except ValueError:
        return str(path)


def _is_allowlisted(path: Path) -> bool:
    try:
        return path.resolve().relative_to(REPO_ROOT.resolve()).as_posix() in ALLOW_STALE_IN
    except ValueError:
        return False


def iter_doc_files(root: Path = REPO_ROOT) -> list[Path]:
    files: list[Path] = []
    for pattern in ("*.md", ".cursorrules", "*.yaml", "*.yml"):
        files.extend(p for p in root.rglob(pattern) if ".git" not in p.parts)
    return sorted(files)


def extract_local_links(text: str) -> list[str]:
    links: list[str] = []
    for raw in MD_LINK_RE.findall(text):
        target = raw.strip().split()[0].strip("<>")
        if target.startswith(("http://", "https://", "mailto:", "#")):
            continue
        if target.startswith("../../"):
            continue
        links.append(target.split("#", 1)[0])
    return links


def unclosed_fences(text: str) -> bool:
    open_fence: str | None = None
    for line in text.splitlines():
        match = FENCE_RE.match(line.strip())
        if not match:
            continue
        marker = match.group(1)
        if open_fence is None:
            open_fence = marker
        elif len(marker) >= len(open_fence):
            open_fence = None
    return open_fence is not None


def validate_required_files(root: Path = REPO_ROOT) -> list[Finding]:
    errors: list[Finding] = []
    for rel in REQUIRED_FILES:
        if not (root / rel).is_file():
            errors.append(Finding(rel, "archivo obligatorio ausente"))
    return errors


def validate_file(path: Path, root: Path = REPO_ROOT) -> list[Finding]:
    errors: list[Finding] = []
    rel = _rel(path, root)
    text = path.read_text(encoding="utf-8")

    if unclosed_fences(text):
        errors.append(Finding(rel, "bloque de código Markdown sin cerrar"))

    if not _is_allowlisted(path):
        for stale in STALE_FILENAMES:
            if stale in text:
                errors.append(Finding(rel, f"referencia obsoleta a `{stale}`"))
        for pattern in STALE_PROJECT_PATH_PATTERNS:
            if pattern.search(text):
                errors.append(
                    Finding(
                        rel,
                        "ruta de proyecto obsoleta `applications/`; usar `proyectos/web/{proyecto}/`",
                    )
                )
                break

    for link in extract_local_links(text):
        if not link:
            continue
        candidate = (path.parent / link).resolve()
        try:
            candidate.relative_to(root.resolve())
        except ValueError:
            continue
        if not candidate.exists():
            errors.append(Finding(rel, f"enlace roto: `{link}`"))

    return errors


def validate_canonical_mentions(root: Path = REPO_ROOT) -> list[Finding]:
    must_mention = (
        "README.md",
        "docs/documentation.md",
        "docs/instructivo-nuevos-usuarios.md",
        "workflows/application-lifecycle.md",
        "templates/README.md",
        ".cursorrules",
        "agents/README.md",
    )
    errors: list[Finding] = []
    for rel in must_mention:
        text = (root / rel).read_text(encoding="utf-8")
        if CANONICAL_PATH not in text:
            errors.append(
                Finding(rel, f"no menciona la ruta canónica `{CANONICAL_PATH}`")
            )
    return errors


def validate_gate_flags(root: Path = REPO_ROOT) -> list[Finding]:
    errors: list[Finding] = []
    feat = (root / "templates/02-features.md").read_text(encoding="utf-8")
    if "audit_2_passed" in feat:
        errors.append(
            Finding(
                "templates/02-features.md",
                "flag `audit_2_passed` no pertenece al Gate 1",
            )
        )
    if "landing-B | sitio-A | portfolio" in feat:
        errors.append(
            Finding(
                "templates/02-features.md",
                "SKU libre (`portfolio`); vigente: solo `A` o `B`",
            )
        )
    html_path = root / "templates/04-html-design.md"
    if not html_path.is_file():
        errors.append(Finding("templates/04-html-design.md", "plantilla ausente"))
    else:
        html = html_path.read_text(encoding="utf-8")
        if re.search(r"^audit_2_passed:", html, re.MULTILINE):
            errors.append(
                Finding(
                    "templates/04-html-design.md",
                    "flag `audit_2_passed` en frontmatter; pertenece a 03 (Gate 2)",
                )
            )
        if re.search(r"^ready_for_construction:", html, re.MULTILINE):
            errors.append(
                Finding(
                    "templates/04-html-design.md",
                    "flag `ready_for_construction` en 04; vigente en 05",
                )
            )
        for required in (
            "visual_approval_passed",
            "audit_3_passed",
            "construction_phase_complete",
        ):
            if required not in html:
                errors.append(
                    Finding("templates/04-html-design.md", f"falta flag `{required}`")
                )
    build_path = root / "templates/05-build-plan.md"
    if not build_path.is_file():
        errors.append(Finding("templates/05-build-plan.md", "plantilla 05 ausente"))
    else:
        build = build_path.read_text(encoding="utf-8")
        if "ready_for_construction" not in build:
            errors.append(
                Finding(
                    "templates/05-build-plan.md",
                    "falta flag `ready_for_construction`",
                )
            )
        if "sku-contract.yaml" not in build:
            errors.append(
                Finding(
                    "templates/05-build-plan.md",
                    "no referencia `standards/sku-contract.yaml`",
                )
            )
    for rel in ("templates/01-problem.md", "templates/02-features.md"):
        path = root / rel
        if not path.is_file():
            errors.append(Finding(rel, "plantilla ausente"))
            continue
        text = path.read_text(encoding="utf-8")
        if not re.search(r"^sku:", text, re.MULTILINE):
            errors.append(Finding(rel, "falta frontmatter `sku`"))
    mod_path = root / "templates/03-module-discovery.md"
    if not mod_path.is_file():
        errors.append(Finding("templates/03-module-discovery.md", "plantilla ausente"))
    else:
        mod = mod_path.read_text(encoding="utf-8")
        if "audit_2_passed" not in mod:
            errors.append(
                Finding("templates/03-module-discovery.md", "falta flag `audit_2_passed`")
            )
        if "MOD-DIR" not in mod:
            errors.append(
                Finding("templates/03-module-discovery.md", "falta bloque MOD-DIR")
            )
    return errors


def validate_cursorrules(root: Path = REPO_ROOT) -> list[Finding]:
    errors: list[Finding] = []
    text = (root / ".cursorrules").read_text(encoding="utf-8")
    if "contenido pendiente" in text.lower():
        errors.append(Finding(".cursorrules", "gates pendientes de redacción"))
    for flag in (
        "audit_1_passed",
        "audit_2_passed",
        "visual_approval_passed",
        "audit_3_passed",
        "ready_for_construction",
    ):
        if flag not in text:
            errors.append(Finding(".cursorrules", f"no declara gate `{flag}`"))
    if "Fase 1" not in text or "Fase 2" not in text:
        errors.append(Finding(".cursorrules", "no declara contrato Fase 1 / Fase 2"))
    if "sku-contract.yaml" not in text:
        errors.append(Finding(".cursorrules", "no referencia `sku-contract.yaml`"))
    if "05-build-plan.md" not in text:
        errors.append(Finding(".cursorrules", "Gate 3B no incluye `05-build-plan.md`"))
    return errors


def validate_direction_matrix(root: Path = REPO_ROOT) -> list[Finding]:
    errors: list[Finding] = []
    rel = "standards/direction-matrix.yaml"
    text = (root / rel).read_text(encoding="utf-8")
    if "default_skill:" not in text:
        errors.append(Finding(rel, "falta `default_skill`"))
    for skill in DIRECTION_SKILLS:
        if skill not in text:
            errors.append(Finding(rel, f"no mapea skill `{skill}`"))
    if "image-to-code" not in text:
        errors.append(Finding(rel, "falta `image-to-code` en forbidden de fase 2"))
    return errors


def validate_sku_contract(root: Path = REPO_ROOT) -> list[Finding]:
    errors: list[Finding] = []
    rel = "standards/sku-contract.yaml"
    path = root / rel
    if not path.is_file():
        errors.append(Finding(rel, "archivo obligatorio ausente"))
        return errors
    text = path.read_text(encoding="utf-8")
    if "forbidden_v1:" not in text:
        errors.append(Finding(rel, "falta `forbidden_v1`"))
    for token in ("wordpress", "vercel", "vps", "repo-por-cliente"):
        if token not in text:
            errors.append(Finding(rel, f"forbidden_v1 no lista `{token}`"))
    if not re.search(r"^\s*B:", text, re.MULTILINE):
        errors.append(Finding(rel, "no declara SKU B"))
    if not re.search(r"^\s*A:", text, re.MULTILINE):
        errors.append(Finding(rel, "no declara SKU A"))
    if "workers" not in text.lower() and "Workers" not in text:
        errors.append(Finding(rel, "stack canónico no declara Workers"))
    return errors


def validate_push_md(root: Path = REPO_ROOT) -> list[Finding]:
    errors: list[Finding] = []
    rel = "PUSH.md"
    path = root / rel
    if not path.is_file():
        return errors
    text = path.read_text(encoding="utf-8")
    if "wika-fundaments.git" in text and "clone -b cursor/web-design-mirror" in text:
        errors.append(
            Finding(
                rel,
                "instrucciones obsoletas: clonar wika-fundaments para publicar web-design",
            )
        )
    return errors


def validate_repo(root: Path = REPO_ROOT) -> ValidationResult:
    result = ValidationResult()
    result.errors.extend(validate_required_files(root))
    result.errors.extend(validate_canonical_mentions(root))
    result.errors.extend(validate_gate_flags(root))
    result.errors.extend(validate_cursorrules(root))
    result.errors.extend(validate_direction_matrix(root))
    result.errors.extend(validate_sku_contract(root))
    result.errors.extend(validate_push_md(root))
    for path in iter_doc_files(root):
        result.errors.extend(validate_file(path, root))
    return result


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        type=Path,
        default=REPO_ROOT,
        help="Raíz del repositorio a validar",
    )
    args = parser.parse_args(argv)
    result = validate_repo(args.root.resolve())
    if result.ok:
        print("validate_docs: OK")
        return 0
    print("validate_docs: FAIL", file=sys.stderr)
    for finding in result.errors:
        print(f"  - {finding.path}: {finding.message}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
