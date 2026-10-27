#!/usr/bin/env python3
"""Valida consistencia interna de wika-fundaments (enlaces, nombres, gates)."""

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
    "bodega.md",
    "auditoria-release.md",  # nombre histórico; vigente: auditoria-release-v1.md
)

# Rutas de proyecto pre-v2.1. La ruta canónica es proyectos/app/{proyecto}/.
STALE_PROJECT_PATH_PATTERNS = (
    re.compile(r"applications/\s*\n", re.MULTILINE),
    re.compile(r"applications/<proyecto>"),
    re.compile(r"applications/proyecto"),
    re.compile(r"applications/nombre-proyecto"),
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
    "docs/repositories.md",
    "docs/instructivo-nuevos-usuarios.md",
    "workflows/application-lifecycle.md",
    "templates/01-problem.md",
    "templates/02-features.md",
    "templates/03-module-discovery.md",
    "templates/04-application-design.md",
    "templates/05-build-plan.md",
    "standards/coding-standards.md",
    "standards/design-system.md",
    ".cursorrules",
    "agents/README.md",
    "agents/roles-humanos.md",
    "agents/wika-bootstrap.md",
    "agents/wika-scribe.md",
    "agents/wika-auditor.md",
    "agents/wika-designer.md",
    "agents/wika-builder.md",
    "agents/wika-refiner.md",
    "agents/wika-packager.md",
    "docs/vision-wika-studio.md",
    "docs/studio-product-spec.md",
    "docs/studio-readiness-checklist.md",
    "docs/audit-event-schema.md",
    "docs/agent-orchestration.md",
    "docs/studio-api-contract.md",
    "docs/iteration-environment-spec.md",
    "docs/validate-project-spec.md",
    "docs/repositorio-proyectos.md",
    "docs/repositorio-wika-studio.md",
    "docs/proyecto-referencia.md",
    "workflows/process-engine.md",
    "workflows/exploration-vs-construction.md",
    "standards/solution-types.md",
    "standards/coding-standards-web.md",
    "schemas/README.md",
    "schemas/01-problem.schema.json",
    "schemas/02-features.schema.json",
    "schemas/03-module-discovery.schema.json",
    "schemas/04-application-design.schema.json",
    "schemas/05-build-plan.schema.json",
    "scripts/validate_project.py",
)

MD_LINK_RE = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
FENCE_RE = re.compile(r"^(`{3,})")
PIPELINE_10_RE = re.compile(r"10 etapas")
FLUTTER_DEFAULT_RE = re.compile(r"Estructura Flutter")
CANONICAL_PATH = "proyectos/app/"

REQUIRED_AGENT_IDS = (
    "wika-bootstrap",
    "wika-scribe",
    "wika-auditor",
    "wika-designer",
    "wika-builder",
    "wika-refiner",
    "wika-packager",
)

AGENT_ID_RE = re.compile(r"`(wika-[a-z-]+)`")


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
    for pattern in ("*.md", ".cursorrules"):
        files.extend(p for p in root.rglob(pattern) if ".git" not in p.parts)
    return sorted(files)


def extract_local_links(text: str) -> list[str]:
    links: list[str] = []
    for raw in MD_LINK_RE.findall(text):
        target = raw.strip().split()[0].strip("<>")
        if target.startswith(("http://", "https://", "mailto:", "#")):
            continue
        if target.startswith("../../"):
            # Enlaces a repositorios hermanos (p. ej. design-system/).
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
                errors.append(
                    Finding(rel, f"referencia obsoleta a `{stale}`")
                )
        for pattern in STALE_PROJECT_PATH_PATTERNS:
            if pattern.search(text):
                errors.append(
                    Finding(
                        rel,
                        "ruta de proyecto obsoleta `applications/`; usar `proyectos/app/{proyecto}/`",
                    )
                )
                break
        if PIPELINE_10_RE.search(text):
            errors.append(
                Finding(rel, "pipeline design-system indicado como 10 etapas; vigente: 12")
            )
        if FLUTTER_DEFAULT_RE.search(text):
            errors.append(
                Finding(
                    rel,
                    "stack móvil por defecto Flutter; vigente: Expo SDK 52 + React Native",
                )
            )

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
    """Fuentes oficiales de proceso deben mencionar la ruta canónica."""
    must_mention = (
        "README.md",
        "docs/documentation.md",
        "docs/repositories.md",
        "docs/instructivo-nuevos-usuarios.md",
        "workflows/application-lifecycle.md",
        "templates/README.md",
        ".cursorrules",
        "agents/README.md",
        "docs/repositorio-wika-studio.md",
        "ROADMAP.md",
    )
    errors: list[Finding] = []
    for rel in must_mention:
        text = (root / rel).read_text(encoding="utf-8")
        if CANONICAL_PATH not in text:
            errors.append(
                Finding(rel, f"no menciona la ruta canónica `{CANONICAL_PATH}`")
            )
    return errors


def validate_agent_catalog(root: Path = REPO_ROOT) -> list[Finding]:
    """El índice de agents/ debe listar fichas existentes con future_skill."""
    errors: list[Finding] = []
    readme = root / "agents/README.md"
    if not readme.is_file():
        errors.append(Finding("agents/README.md", "índice de agentes ausente"))
        return errors

    index_text = readme.read_text(encoding="utf-8")
    listed = set(AGENT_ID_RE.findall(index_text))

    if "roles-humanos.md" not in index_text:
        errors.append(
            Finding("agents/README.md", "no enlaza `roles-humanos.md`")
        )

    for agent_id in REQUIRED_AGENT_IDS:
        rel = f"agents/{agent_id}.md"
        path = root / rel
        if agent_id not in listed:
            errors.append(
                Finding("agents/README.md", f"no lista `{agent_id}`")
            )
        if not path.is_file():
            errors.append(Finding(rel, "ficha de agente ausente"))
            continue
        body = path.read_text(encoding="utf-8")
        if "future_skill:" not in body:
            errors.append(Finding(rel, "falta `future_skill` en frontmatter"))
        if "hands_off_to:" not in body:
            errors.append(Finding(rel, "falta `hands_off_to` en frontmatter"))
        if CANONICAL_PATH not in body:
            errors.append(
                Finding(rel, f"no menciona la ruta canónica `{CANONICAL_PATH}`")
            )

    return errors


def validate_repo(root: Path = REPO_ROOT) -> ValidationResult:
    result = ValidationResult()
    result.errors.extend(validate_required_files(root))
    result.errors.extend(validate_canonical_mentions(root))
    result.errors.extend(validate_agent_catalog(root))
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
