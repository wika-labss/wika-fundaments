#!/usr/bin/env python3
"""Valida estructura y frontmatter de proyectos WIKA bajo proyectos/app/{proyecto}/."""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
SCHEMAS_DIR = REPO_ROOT / "schemas"

IDEA_FILES = (
    "01-problem.md",
    "02-features.md",
    "03-module-discovery.md",
    "04-application-design.md",
    "05-build-plan.md",
)

REQUIRED_DIRS = ("idea", "audits", "iterations", "final")

SCHEMA_BY_FILE = {
    "01-problem.md": "01-problem.schema.json",
    "02-features.md": "02-features.schema.json",
    "03-module-discovery.md": "03-module-discovery.schema.json",
    "04-application-design.md": "04-application-design.schema.json",
    "05-build-plan.md": "05-build-plan.schema.json",
}


@dataclass
class Finding:
    path: str
    message: str
    severity: str = "error"


@dataclass
class ValidationResult:
    findings: list[Finding] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return not any(f.severity == "error" for f in self.findings)


def _rel(path: Path, base: Path) -> str:
    try:
        return path.resolve().relative_to(base.resolve()).as_posix()
    except ValueError:
        return str(path)


def parse_frontmatter(text: str) -> tuple[dict[str, Any] | None, str]:
    if not text.startswith("---"):
        return None, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return None, text
    raw_yaml = parts[1]
    body = parts[2]
    data: dict[str, Any] = {}
    current_key: str | None = None
    list_key: str | None = None

    for line in raw_yaml.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped.startswith("- ") and list_key:
            item = stripped[2:].strip().strip('"').strip("'")
            data.setdefault(list_key, []).append(item)
            continue
        list_key = None
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        key = key.strip()
        value = value.strip()
        current_key = key
        if value == "":
            list_key = key
            data[key] = []
            continue
        if value in ("true", "false"):
            data[key] = value == "true"
        elif value.startswith("[") and value.endswith("]"):
            inner = value[1:-1].strip()
            if not inner:
                data[key] = []
            else:
                data[key] = [
                    p.strip().strip('"').strip("'")
                    for p in inner.split(",")
                    if p.strip()
                ]
        else:
            data[key] = value.strip('"').strip("'")
    return data, body


def _load_schema(name: str) -> dict[str, Any] | None:
    path = SCHEMAS_DIR / name
    if not path.is_file():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def validate_schema_fields(
    rel_file: str, meta: dict[str, Any], schema: dict[str, Any]
) -> list[Finding]:
    findings: list[Finding] = []
    required = schema.get("required", [])
    properties = schema.get("properties", {})
    for key in required:
        if key not in meta:
            findings.append(Finding(rel_file, f"frontmatter falta `{key}`"))
    for key, value in meta.items():
        if key not in properties:
            continue
        prop = properties[key]
        if "enum" in prop and value not in prop["enum"]:
            findings.append(
                Finding(rel_file, f"`{key}` valor inválido `{value}`")
            )
        if prop.get("type") == "boolean" and not isinstance(value, bool):
            findings.append(Finding(rel_file, f"`{key}` debe ser boolean"))
        if prop.get("type") == "array" and not isinstance(value, list):
            findings.append(Finding(rel_file, f"`{key}` debe ser array"))
        pattern = prop.get("pattern")
        if pattern and isinstance(value, str):
            if not re.match(pattern, value):
                findings.append(
                    Finding(rel_file, f"`{key}` no cumple pattern {pattern}")
                )
    return findings


def validate_flag_coherence(project: Path, metas: dict[str, dict[str, Any]]) -> list[Finding]:
    findings: list[Finding] = []
    base = _rel(project, project.parent.parent.parent if project.name else project)

    m01 = metas.get("01-problem.md", {})
    m02 = metas.get("02-features.md", {})
    m03 = metas.get("03-module-discovery.md", {})
    m04 = metas.get("04-application-design.md", {})
    m05 = metas.get("05-build-plan.md", {})

    a1_01 = m01.get("audit_1_passed")
    a1_02 = m02.get("audit_1_passed")
    if a1_01 is not None and a1_02 is not None and a1_01 != a1_02:
        findings.append(Finding(base, "audit_1 inconsistente entre 01 y 02"))

    if m03.get("audit_2_passed") and not all(
        m.get("audit_1_passed") for m in (m01, m02, m03) if "audit_1_passed" in m
    ):
        findings.append(Finding(base, "gate 2 sin gate 1"))

    if m04.get("visual_approval_passed") and not m03.get("audit_2_passed"):
        findings.append(Finding(base, "gate 3a sin gate 2"))

    flags_before_ready = (
        m05.get("audit_1_passed"),
        m05.get("audit_2_passed"),
        m05.get("visual_approval_passed"),
        m05.get("audit_3_passed"),
    )
    if m05.get("ready_for_construction"):
        if not all(flags_before_ready):
            findings.append(Finding(base, "ready_for_construction prematuro"))
        if m04.get("audit_3_passed") is False:
            findings.append(Finding(base, "ready_for_construction sin audit_3 en 04"))

    mode = m01.get("project_mode", "construction")
    final_dir = project / "final"
    if mode == "exploration" and final_dir.is_dir():
        if any(final_dir.iterdir()):
            findings.append(
                Finding(base, "final/ con contenido en modo exploration")
            )

    if (
        mode == "construction"
        and m05.get("ready_for_construction")
        and not (project / "iterations" / "v1").is_dir()
    ):
        findings.append(
            Finding(
                base,
                "iterations/v1 ausente con ready_for_construction",
                severity="warning",
            )
        )

    return findings


def validate_project_path(project: Path) -> ValidationResult:
    result = ValidationResult()
    if not project.is_dir():
        result.findings.append(Finding(str(project), "ruta de proyecto inválida"))
        return result

    rel_base = project.as_posix()
    idea = project / "idea"
    for dirname in REQUIRED_DIRS:
        if not (project / dirname).is_dir():
            result.findings.append(
                Finding(rel_base, f"directorio obligatorio ausente `{dirname}/`")
            )

    metas: dict[str, dict[str, Any]] = {}
    for filename in IDEA_FILES:
        path = idea / filename
        rel_file = _rel(path, project)
        if not path.is_file():
            result.findings.append(Finding(rel_base, f"falta idea/{filename}"))
            continue
        meta, _ = parse_frontmatter(path.read_text(encoding="utf-8"))
        if meta is None:
            result.findings.append(Finding(rel_file, "frontmatter YAML ausente"))
            continue
        metas[filename] = meta
        schema_name = SCHEMA_BY_FILE.get(filename)
        if schema_name:
            schema = _load_schema(schema_name)
            if schema:
                result.findings.extend(validate_schema_fields(rel_file, meta, schema))

    if metas:
        result.findings.extend(validate_flag_coherence(project, metas))

    return result


def discover_projects(root: Path) -> list[Path]:
    app_dir = root / "app"
    if app_dir.is_dir():
        return sorted(p for p in app_dir.iterdir() if p.is_dir())
    return []


def validate_root(root: Path) -> ValidationResult:
    result = ValidationResult()
    projects = discover_projects(root)
    if not projects:
        result.findings.append(Finding(root.as_posix(), "no hay proyectos bajo app/"))
        return result
    for project in projects:
        sub = validate_project_path(project)
        result.findings.extend(sub.findings)
    return result


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--project",
        type=Path,
        help="Ruta a proyectos/app/{proyecto}/",
    )
    group.add_argument(
        "--root",
        type=Path,
        help="Raíz del repo proyectos (contiene app/)",
    )
    args = parser.parse_args(argv)

    if args.project:
        result = validate_project_path(args.project.resolve())
    else:
        result = validate_root(args.root.resolve())

    if result.ok:
        warnings = [f for f in result.findings if f.severity == "warning"]
        print("validate_project: OK")
        for w in warnings:
            print(f"  warning: {w.path}: {w.message}")
        return 0
    print("validate_project: FAIL", file=sys.stderr)
    for finding in result.findings:
        if finding.severity == "error":
            print(f"  - {finding.path}: {finding.message}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
