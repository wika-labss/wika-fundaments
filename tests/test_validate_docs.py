#!/usr/bin/env python3
"""Tests de consistencia documental (BUG-001 … BUG-013)."""

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

    def test_bug001_stale_audit_filenames(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "lifecycle.md"
            path.write_text("Ver docs/auditoria-1.md y docs/auditoria-2.md\n", encoding="utf-8")
            messages = [f.message for f in validate_docs.validate_file(path, Path(tmp))]
        self.assertTrue(any("auditoria-1.md" in m for m in messages))
        self.assertTrue(any("auditoria-2.md" in m for m in messages))

    def test_bug003_stale_applications_path(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "docs.md"
            path.write_text("Crear en applications/<proyecto>/idea/\n", encoding="utf-8")
            messages = [f.message for f in validate_docs.validate_file(path, Path(tmp))]
        self.assertTrue(any("applications/" in m for m in messages))

    def test_bug005_pipeline_10_etapas(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "rules.md"
            path.write_text("Pipeline completo design-system/ (10 etapas)\n", encoding="utf-8")
            messages = [f.message for f in validate_docs.validate_file(path, Path(tmp))]
        self.assertTrue(any("10 etapas" in m for m in messages))

    def test_bug006_flutter_default_stack(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "repos.md"
            path.write_text("- Estructura Flutter\n", encoding="utf-8")
            messages = [f.message for f in validate_docs.validate_file(path, Path(tmp))]
        self.assertTrue(any("Flutter" in m for m in messages))

    def test_bug012_unclosed_readme_fence(self) -> None:
        text = "```text\nIdea\n↓\nPublicación\n\n# Estructura\n"
        self.assertTrue(validate_docs.unclosed_fences(text))


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
        self.assertIn("proyectos/app/", text)
        self.assertNotIn("docs/auditoria-1.md", text)
        self.assertNotIn("docs/auditoria-2.md", text)

    def test_release_audit_exists_and_is_linked(self) -> None:
        release = ROOT / "docs/auditoria-release-v1.md"
        self.assertTrue(release.is_file())
        docs_index = (ROOT / "docs/README.md").read_text(encoding="utf-8")
        self.assertIn("auditoria-release-v1.md", docs_index)

    def test_features_template_has_no_audit_2_flag(self) -> None:
        text = (ROOT / "templates/02-features.md").read_text(encoding="utf-8")
        self.assertNotIn("audit_2_passed", text)

    def test_cursorrules_pipeline_12(self) -> None:
        text = (ROOT / ".cursorrules").read_text(encoding="utf-8")
        self.assertIn("12 etapas", text)
        self.assertNotIn("10 etapas", text)


if __name__ == "__main__":
    unittest.main()
