#!/usr/bin/env python3
"""Tests de validate_project."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import validate_project  # noqa: E402

FIXTURES = Path(__file__).resolve().parent / "fixtures" / "sample-project"
GOLD = FIXTURES / "gold"
INVALID = FIXTURES / "invalid-ready"


class ValidateProjectTests(unittest.TestCase):
    def test_gold_project_ok(self) -> None:
        result = validate_project.validate_project_path(GOLD)
        errors = [f for f in result.findings if f.severity == "error"]
        self.assertEqual(errors, [])
        self.assertTrue(result.ok)

    def test_invalid_ready_fails(self) -> None:
        result = validate_project.validate_project_path(INVALID)
        messages = " ".join(f.message for f in result.findings)
        self.assertFalse(result.ok)
        self.assertIn("ready_for_construction prematuro", messages)

    def test_main_gold_exit_zero(self) -> None:
        code = validate_project.main(["--project", str(GOLD)])
        self.assertEqual(code, 0)

    def test_main_invalid_exit_one(self) -> None:
        code = validate_project.main(["--project", str(INVALID)])
        self.assertEqual(code, 1)


if __name__ == "__main__":
    unittest.main()
