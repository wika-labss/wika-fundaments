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


class AgentCatalogTests(unittest.TestCase):
    def test_live_catalog_ok(self) -> None:
        errors = validate_docs.validate_agent_catalog(ROOT)
        self.assertEqual(
            errors,
            [],
            msg="\n".join(f"{e.path}: {e.message}" for e in errors),
        )

    def test_index_lists_all_required_ids(self) -> None:
        text = (ROOT / "agents/README.md").read_text(encoding="utf-8")
        for agent_id in validate_docs.REQUIRED_AGENT_IDS:
            self.assertIn(f"`{agent_id}`", text)
            self.assertTrue((ROOT / f"agents/{agent_id}.md").is_file())

    def test_missing_card_is_reported(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            agents = root / "agents"
            agents.mkdir()
            (agents / "README.md").write_text(
                "`wika-bootstrap` [roles-humanos.md](roles-humanos.md)\n",
                encoding="utf-8",
            )
            (agents / "roles-humanos.md").write_text("humano\n", encoding="utf-8")
            messages = [f"{e.path}: {e.message}" for e in validate_docs.validate_agent_catalog(root)]
        self.assertTrue(any("wika-scribe" in m and "ausente" in m for m in messages))
        self.assertTrue(any("no lista `wika-scribe`" in m for m in messages))

    def test_card_without_future_skill_fails(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            agents = root / "agents"
            agents.mkdir()
            ids = " ".join(f"`{aid}`" for aid in validate_docs.REQUIRED_AGENT_IDS)
            (agents / "README.md").write_text(
                f"{ids}\nroles-humanos.md\n",
                encoding="utf-8",
            )
            for aid in validate_docs.REQUIRED_AGENT_IDS:
                (agents / f"{aid}.md").write_text(
                    "hands_off_to: x\nproyectos/app/\n",
                    encoding="utf-8",
                )
            messages = [e.message for e in validate_docs.validate_agent_catalog(root)]
        self.assertTrue(any("future_skill" in m for m in messages))


class SkillCatalogTests(unittest.TestCase):
    def test_live_skills_ok(self) -> None:
        errors = validate_docs.validate_skills(ROOT)
        self.assertEqual(
            errors,
            [],
            msg="\n".join(f"{e.path}: {e.message}" for e in errors),
        )

    def test_each_agent_has_matching_skill_name(self) -> None:
        for skill_id in validate_docs.REQUIRED_SKILL_IDS:
            path = ROOT / "skills" / skill_id / "SKILL.md"
            text = path.read_text(encoding="utf-8")
            names = validate_docs.SKILL_NAME_RE.findall(text)
            self.assertEqual(names[0], skill_id)
            self.assertIn("description:", text)

    def test_missing_skill_is_reported(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "skills").mkdir()
            messages = [f"{e.path}: {e.message}" for e in validate_docs.validate_skills(root)]
        self.assertTrue(any("wika-bootstrap" in m and "ausente" in m for m in messages))
        self.assertTrue(any("wika-orchestrator" in m for m in messages))

    def test_wrong_skill_name_fails(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for skill_id in validate_docs.REQUIRED_SKILL_IDS:
                folder = root / "skills" / skill_id
                folder.mkdir(parents=True)
                (folder / "SKILL.md").write_text(
                    "---\nname: other-skill\ndescription: x\n---\n",
                    encoding="utf-8",
                )
            messages = [e.message for e in validate_docs.validate_skills(root)]
        self.assertTrue(any("esperado" in m for m in messages))


if __name__ == "__main__":
    unittest.main()
