#!/usr/bin/env python3
"""Smoke del flujo WIKA (orquestador → agentes) en un sandbox.

No escribe código de producto en este repositorio. Simula Arquitecto solo
cuando el caller lo pide de forma explícita (test de gates).
"""

from __future__ import annotations

import argparse
import re
import shutil
import sys
from dataclasses import dataclass
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TEMPLATES = REPO_ROOT / "templates"

IDEA_DOCS = (
    "01-problem.md",
    "02-features.md",
    "03-module-discovery.md",
    "04-application-design.md",
    "05-build-plan.md",
)

FLAG_NAMES = (
    "audit_1_passed",
    "audit_2_passed",
    "visual_approval_passed",
    "audit_3_passed",
    "ready_for_construction",
)

FLAG_LINE_RE = re.compile(
    r"^(" + "|".join(FLAG_NAMES) + r"):\s*(true|false)\s*$",
    re.MULTILINE,
)

APPROVED_RE = re.compile(r"^## APROBADO\s*$", re.MULTILINE)


@dataclass
class StepResult:
    agent: str
    ok: bool
    detail: str


def project_root(sandbox: Path, name: str) -> Path:
    return sandbox / "proyectos" / "app" / name


def read_flags(path: Path) -> dict[str, bool]:
    text = path.read_text(encoding="utf-8")
    return {k: (v == "true") for k, v in FLAG_LINE_RE.findall(text)}


def any_flag_true(idea: Path) -> bool:
    for doc in IDEA_DOCS:
        path = idea / doc
        if path.is_file() and any(read_flags(path).values()):
            return True
    return False


def set_flag(path: Path, name: str, value: bool) -> None:
    """Solo para el doble de Arquitecto en tests. Los agentes no llaman esto."""
    text = path.read_text(encoding="utf-8")
    new = re.sub(
        rf"^{name}:\s*(true|false)\s*$",
        f"{name}: {'true' if value else 'false'}",
        text,
        count=1,
        flags=re.MULTILINE,
    )
    path.write_text(new, encoding="utf-8")


def bootstrap(sandbox: Path, name: str) -> StepResult:
    root = project_root(sandbox, name)
    if root.exists():
        shutil.rmtree(root)
    for folder in ("idea", "audits", "iterations", "final"):
        (root / folder).mkdir(parents=True)
    for doc in IDEA_DOCS:
        shutil.copy(TEMPLATES / doc, root / "idea" / doc)
    if any_flag_true(root / "idea"):
        return StepResult("wika-bootstrap", False, "flags no quedaron en false")
    if (sandbox / "applications").exists():
        return StepResult("wika-bootstrap", False, "uso de applications/")
    return StepResult("wika-bootstrap", True, str(root.relative_to(sandbox)))


def scribe_01_02(idea: Path) -> StepResult:
    """Rellena 01–02 de prueba. No toca flags."""
    problem = (idea / "01-problem.md").read_text(encoding="utf-8")
    problem = problem.replace("[Nombre del Proyecto]", "Pulse Timer")
    problem = problem.replace("YYYY-MM-DD", "2026-09-15")
    problem = problem.replace("[Nombre del Responsable / Equipo]", "QA Flujo")
    if "ERR-01" not in problem or "FEAT-01" not in problem:
        return StepResult("wika-scribe", False, "plantilla 01 sin RTM")
    extra = (
        "\n\n## Contenido de prueba (scribe)\n\n"
        "- Problema: no hay temporizador de cocina offline de un toque.\n"
        "- Usuario: cocinero casero.\n"
        "- Objetivo V1: iniciar, pausar y completar un countdown en Android sin red.\n"
        "- Out-of-scope: cuentas, iOS, recetas.\n"
    )
    (idea / "01-problem.md").write_text(problem + extra, encoding="utf-8")

    features = (idea / "02-features.md").read_text(encoding="utf-8")
    features = features.replace("YYYY-MM-DD", "2026-09-15")
    extra_f = (
        "\n\n## Contenido de prueba (scribe)\n\n"
        "- FEAT-01 obligatorio: iniciar countdown offline (ERR-01).\n"
        "- FEAT-02 obligatorio: persistir último tiempo (ERR-02).\n"
        "- BDD: Dado app abierta, Cuando inicia 60s, Entonces llega a 0 sin crash.\n"
    )
    (idea / "02-features.md").write_text(features + extra_f, encoding="utf-8")
    if any(read_flags(idea / "01-problem.md").values()) or any(
        read_flags(idea / "02-features.md").values()
    ):
        return StepResult("wika-scribe", False, "scribe mutó flags a true")
    return StepResult("wika-scribe", True, "01+02 rellenados; flags false")


def auditor_draft(audits: Path, gate: str) -> StepResult:
    names = {
        "1": "auditoria-documentacion.md",
        "2": "auditoria-modulos.md",
        "3B": "auditoria-ensamblado.md",
        "Release": "auditoria-release-v1.md",
    }
    filename = names[gate]
    body = (
        f"# Auditoría {gate} (borrador wika-auditor)\n\n"
        "Estado: PENDIENTE_ARQUITECTO\n\n"
        "## Gaps\n\n"
        "- Revisar RTM 1:1 y BDD contra checklist oficial.\n\n"
        "Siguiente: Arquitecto humano. Este archivo no es APROBADO.\n"
    )
    path = audits / filename
    path.write_text(body, encoding="utf-8")
    text = path.read_text(encoding="utf-8")
    if APPROVED_RE.search(text) or "Estado: APROBADO" in text:
        return StepResult("wika-auditor", False, "auditor escribió APROBADO")
    return StepResult("wika-auditor", True, f"borrador {filename}")


def builder_allowed(idea: Path) -> bool:
    plan = idea / "05-build-plan.md"
    if not plan.is_file():
        return False
    flags = read_flags(plan)
    required = (
        "audit_1_passed",
        "audit_2_passed",
        "visual_approval_passed",
        "audit_3_passed",
        "ready_for_construction",
    )
    return all(flags.get(k) for k in required)


def builder_attempt(idea: Path) -> StepResult:
    if not builder_allowed(idea):
        return StepResult(
            "wika-builder",
            True,
            "rechazo correcto: ready_for_construction no es true",
        )
    return StepResult(
        "wika-builder",
        True,
        "precondición OK (no se genera Expo en este smoke)",
    )


def packager_attempt(audits: Path) -> StepResult:
    release = audits / "auditoria-release-v1.md"
    if not release.is_file() or "Estado: APROBADO" not in release.read_text(
        encoding="utf-8"
    ):
        return StepResult(
            "wika-packager",
            True,
            "rechazo correcto: Release no APROBADO",
        )
    return StepResult("wika-packager", False, "habría empaquetado sin firma")


def scribe_03(idea: Path) -> StepResult:
    if not read_flags(idea / "01-problem.md").get("audit_1_passed"):
        return StepResult("wika-scribe", False, "escribió 03 sin Gate 1")
    text = (idea / "03-module-discovery.md").read_text(encoding="utf-8")
    text += (
        "\n\n## Contenido de prueba (scribe)\n\n"
        "- MOD-01 engine countdown (FEAT-01 / ERR-01).\n"
        "- MOD-02 UI expo-router (FEAT-01).\n"
        "- MOD-03 persistencia AsyncStorage (FEAT-02).\n"
    )
    (idea / "03-module-discovery.md").write_text(text, encoding="utf-8")
    return StepResult("wika-scribe", True, "03 tras Gate 1")


def designer_04(idea: Path) -> StepResult:
    if not read_flags(idea / "03-module-discovery.md").get("audit_2_passed"):
        return StepResult("wika-designer", False, "escribió 04 sin Gate 2")
    text = (idea / "04-application-design.md").read_text(encoding="utf-8")
    text += (
        "\n\n## Contenido de prueba (designer)\n\n"
        "- Ruta `/` Home + `/play` countdown.\n"
        "- Tokens: background, accent, text.\n"
        "- Wireframe ASCII: header / tiempo / CTA iniciar.\n"
        "- visual_approval_passed permanece false hasta Arquitecto.\n"
    )
    (idea / "04-application-design.md").write_text(text, encoding="utf-8")
    if read_flags(idea / "04-application-design.md").get("visual_approval_passed"):
        return StepResult("wika-designer", False, "designer activó Gate 3A")
    return StepResult("wika-designer", True, "04 con flags visual false")


def scribe_05(idea: Path) -> StepResult:
    if not read_flags(idea / "04-application-design.md").get("visual_approval_passed"):
        return StepResult("wika-scribe", False, "escribió 05 sin Gate 3A")
    text = (idea / "05-build-plan.md").read_text(encoding="utf-8")
    text += (
        "\n\n## Contenido de prueba (scribe)\n\n"
        "- Paso 01: engine. Paso 02: theme. Paso 03: pantallas. Paso 04: verify.\n"
    )
    (idea / "05-build-plan.md").write_text(text, encoding="utf-8")
    if read_flags(idea / "05-build-plan.md").get("ready_for_construction"):
        return StepResult("wika-scribe", False, "scribe activó ready_for_construction")
    return StepResult("wika-scribe", True, "05 con ready_for_construction false")


def architect_gate1(idea: Path, audits: Path) -> None:
    set_flag(idea / "01-problem.md", "audit_1_passed", True)
    set_flag(idea / "02-features.md", "audit_1_passed", True)
    (audits / "auditoria-documentacion.md").write_text(
        "# Auditoría de Documentación\n\nEstado: APROBADO\n\nFirma: Arquitecto (simulado en smoke).\n",
        encoding="utf-8",
    )


def architect_gate2(idea: Path, audits: Path) -> None:
    set_flag(idea / "03-module-discovery.md", "audit_2_passed", True)
    (audits / "auditoria-modulos.md").write_text(
        "# Auditoría de Módulos\n\nEstado: APROBADO\n\nFirma: Arquitecto (simulado en smoke).\n",
        encoding="utf-8",
    )


def architect_visual(idea: Path) -> None:
    set_flag(idea / "04-application-design.md", "visual_approval_passed", True)


def architect_assembly(idea: Path, audits: Path) -> None:
    set_flag(idea / "04-application-design.md", "audit_3_passed", True)
    for name in FLAG_NAMES:
        set_flag(idea / "05-build-plan.md", name, True)
    (audits / "auditoria-ensamblado.md").write_text(
        "# Auditoría de Ensamblado\n\nEstado: APROBADO\n\nFirma: Arquitecto (simulado en smoke).\n",
        encoding="utf-8",
    )


def run_flow(sandbox: Path, name: str = "pulse-timer") -> list[StepResult]:
    steps: list[StepResult] = []
    steps.append(bootstrap(sandbox, name))
    root = project_root(sandbox, name)
    idea, audits = root / "idea", root / "audits"

    steps.append(scribe_01_02(idea))
    steps.append(auditor_draft(audits, "1"))
    steps.append(builder_attempt(idea))
    steps.append(packager_attempt(audits))

    # 03 sin Gate 1 debe fallar
    skipped = scribe_03(idea)
    if skipped.ok:
        steps.append(StepResult("wika-scribe", False, "03 avanzó sin Gate 1"))
    else:
        steps.append(StepResult("wika-scribe", True, "03 bloqueado sin Gate 1 (esperado)"))

    architect_gate1(idea, audits)
    steps.append(scribe_03(idea))
    steps.append(auditor_draft(audits, "2"))

    skipped_des = designer_04(idea)
    if skipped_des.ok:
        steps.append(StepResult("wika-designer", False, "04 avanzó sin Gate 2"))
    else:
        steps.append(StepResult("wika-designer", True, "04 bloqueado sin Gate 2 (esperado)"))

    architect_gate2(idea, audits)
    steps.append(designer_04(idea))

    skipped_05 = scribe_05(idea)
    if skipped_05.ok:
        steps.append(StepResult("wika-scribe", False, "05 avanzó sin Gate 3A"))
    else:
        steps.append(StepResult("wika-scribe", True, "05 bloqueado sin Gate 3A (esperado)"))

    architect_visual(idea)
    steps.append(scribe_05(idea))
    steps.append(auditor_draft(audits, "3B"))
    steps.append(builder_attempt(idea))
    architect_assembly(idea, audits)
    steps.append(builder_attempt(idea))
    steps.append(auditor_draft(audits, "Release"))
    steps.append(packager_attempt(audits))
    return steps


def report(steps: list[StepResult]) -> int:
    width = max(len(s.agent) for s in steps)
    failed = 0
    for i, step in enumerate(steps, 1):
        mark = "OK" if step.ok else "FAIL"
        if not step.ok:
            failed += 1
        print(f"{i:02d}  {step.agent:<{width}}  {mark:4}  {step.detail}")
    print(f"\n{len(steps) - failed}/{len(steps)} pasos OK")
    return 0 if failed == 0 else 1


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--sandbox",
        type=Path,
        default=None,
        help="Directorio sandbox (default: temporal)",
    )
    parser.add_argument("--name", default="pulse-timer")
    args = parser.parse_args(argv)
    if args.sandbox is None:
        import tempfile

        tmp = tempfile.TemporaryDirectory(prefix="wika-flow-")
        sandbox = Path(tmp.name)
        try:
            return report(run_flow(sandbox, args.name))
        finally:
            tmp.cleanup()
    sandbox = args.sandbox.resolve()
    sandbox.mkdir(parents=True, exist_ok=True)
    return report(run_flow(sandbox, args.name))


if __name__ == "__main__":
    raise SystemExit(main())
