#!/usr/bin/env python3
"""Tests de consistencia documental (BUG-001 … BUG-012)."""

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import validate_docs  # noqa: E402


class ExtractLinksTests(unittest.TestCase):
    def test_ignores_http_and_anchors(self) -> None:
        text = "[a](https://example.com) [b](#seccion) [c](docs/readme.md)"
        self.assertEqual(validate_docs.extract_local_links(text), ["docs/readme.md"])

    def test_strips_hash_and_title(self) -> None:
        text = '[x](foo.md#bar "titulo")'
        self.assertEqual(validate_docs.extract_local_links(text), ["foo.md"])


class FenceTests(unittest.TestCase):
    def test_detects_unclosed_fence(self) -> None:
        self.assertTrue(validate_docs.unclosed_fences("```text\nIdea\n"))

    def test_balanced_fences_ok(self) -> None:
        self.assertFalse(validate_docs.unclosed_fences("```text\nIdea\n```\n"))


class BugRegressionTests(unittest.TestCase):
    """Estos casos fallarían con el contenido previo a las correcciones."""

    def test_bug001_stale_applications_path(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "readme.md"
            path.write_text(
                "Los sitios concretos viven en `applications/proyectos/web/{proyecto}/`.\n",
                encoding="utf-8",
            )
            messages = [f.message for f in validate_docs.validate_file(path, Path(tmp))]
        self.assertTrue(any("applications/" in m for m in messages))

    def test_bug005_stale_push_clone(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "PUSH.md").write_text(
                "git clone -b cursor/web-design-mirror-94c1 "
                "--recurse-submodules https://github.com/wika-labss/wika-fundaments.git web-design\n",
                encoding="utf-8",
            )
            messages = [f.message for f in validate_docs.validate_push_md(root)]
        self.assertTrue(any("wika-fundaments" in m for m in messages))

    def test_bug006_audit_2_on_html_template(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            templates = root / "templates"
            templates.mkdir()
            (templates / "02-features.md").write_text("audit_1_passed: false\n", encoding="utf-8")
            (templates / "03-module-discovery.md").write_text(
                "audit_2_passed: false\nMOD-DIR\n", encoding="utf-8"
            )
            (templates / "04-html-design.md").write_text(
                "audit_2_passed: false\nvisual_approval_passed: false\n",
                encoding="utf-8",
            )
            messages = [f"{f.path}: {f.message}" for f in validate_docs.validate_gate_flags(root)]
        self.assertTrue(any("audit_2_passed" in m and "04-html-design.md" in m for m in messages))


class LiveRepoTests(unittest.TestCase):
    def test_repo_passes_after_fix(self) -> None:
        result = validate_docs.validate_repo(ROOT)
        self.assertEqual(
            result.errors,
            [],
            msg="\n".join(f"{e.path}: {e.message}" for e in result.errors),
        )

    def test_canonical_path_in_lifecycle(self) -> None:
        text = (ROOT / "workflows/application-lifecycle.md").read_text(encoding="utf-8")
        self.assertIn("proyectos/web/", text)
        self.assertNotIn("applications/proyectos", text)

    def test_release_audit_exists_and_is_linked(self) -> None:
        release = ROOT / "docs/auditoria-release-v1.md"
        self.assertTrue(release.is_file())
        docs_index = (ROOT / "docs/README.md").read_text(encoding="utf-8")
        self.assertIn("auditoria-release-v1.md", docs_index)

    def test_features_template_has_no_audit_2_flag(self) -> None:
        text = (ROOT / "templates/02-features.md").read_text(encoding="utf-8")
        self.assertNotIn("audit_2_passed", text)

    def test_html_template_has_no_audit_2_frontmatter(self) -> None:
        text = (ROOT / "templates/04-html-design.md").read_text(encoding="utf-8")
        self.assertNotRegex(text, r"^audit_2_passed:")
        self.assertNotRegex(text, r"^ready_for_construction:")
        self.assertIn("audit_3_passed", text)
        build = (ROOT / "templates/05-build-plan.md").read_text(encoding="utf-8")
        self.assertIn("ready_for_construction", build)

    def test_problem_and_features_have_sku(self) -> None:
        for rel in ("templates/01-problem.md", "templates/02-features.md"):
            text = (ROOT / rel).read_text(encoding="utf-8")
            self.assertRegex(text, r"(?m)^sku:", msg=rel)
        feat = (ROOT / "templates/02-features.md").read_text(encoding="utf-8")
        self.assertNotIn("landing-B | sitio-A | portfolio", feat)

    def test_lifecycle_includes_05_before_assembly(self) -> None:
        text = (ROOT / "workflows/application-lifecycle.md").read_text(encoding="utf-8")
        self.assertIn("05-build-plan.md", text)
        self.assertIn("sku-contract.yaml", text)

    def test_cursorrules_has_gates(self) -> None:
        text = (ROOT / ".cursorrules").read_text(encoding="utf-8")
        self.assertIn("audit_1_passed", text)
        self.assertIn("Fase 1", text)
        self.assertIn("Fase 2", text)
        self.assertNotIn("contenido pendiente", text.lower())

    def test_push_points_to_audit_mirror_not_old_skeleton(self) -> None:
        text = (ROOT / "PUSH.md").read_text(encoding="utf-8")
        self.assertIn("cursor/web-design-docs-audit-032d", text)
        self.assertNotIn("cursor/web-design-mirror-94c1.git", text)
        self.assertNotIn(
            "git clone -b cursor/web-design-mirror-94c1",
            text,
        )

    def test_workflows_readme_points_to_local_lifecycle(self) -> None:
        text = (ROOT / "workflows/README.md").read_text(encoding="utf-8")
        self.assertIn("application-lifecycle.md", text)
        self.assertIn("proyectos/app/", text)


class DirectionMatrixTests(unittest.TestCase):
    def test_live_matrix_ok(self) -> None:
        errors = validate_docs.validate_direction_matrix(ROOT)
        self.assertEqual(
            errors,
            [],
            msg="\n".join(f"{e.path}: {e.message}" for e in errors),
        )


class SkuContractTests(unittest.TestCase):
    def test_live_contract_ok(self) -> None:
        errors = validate_docs.validate_sku_contract(ROOT)
        self.assertEqual(
            errors,
            [],
            msg="\n".join(f"{e.path}: {e.message}" for e in errors),
        )

    def test_missing_forbidden_is_reported(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            standards = root / "standards"
            standards.mkdir()
            (standards / "sku-contract.yaml").write_text(
                "skus:\n  A:\n  B:\n",
                encoding="utf-8",
            )
            messages = [e.message for e in validate_docs.validate_sku_contract(root)]
        self.assertTrue(any("forbidden_v1" in m for m in messages))


if __name__ == "__main__":
    unittest.main()
