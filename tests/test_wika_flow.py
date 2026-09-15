#!/usr/bin/env python3
"""Prueba del flujo WIKA (skills/agentes) en sandbox."""

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import run_flow_smoke  # noqa: E402


class WikaFlowSmokeTests(unittest.TestCase):
    def test_full_flow_enforces_gates(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            steps = run_flow_smoke.run_flow(Path(tmp), "pulse-timer")
        failed = [s for s in steps if not s.ok]
        self.assertEqual(failed, [], msg="\n".join(f"{s.agent}: {s.detail}" for s in failed))

        details = [s.detail for s in steps]
        self.assertTrue(any("03 bloqueado sin Gate 1" in d for d in details))
        self.assertTrue(any("04 bloqueado sin Gate 2" in d for d in details))
        self.assertTrue(any("05 bloqueado sin Gate 3A" in d for d in details))
        self.assertTrue(any("ready_for_construction no es true" in d for d in details))
        self.assertTrue(any("precondición OK" in d for d in details))
        self.assertTrue(any("Release no APROBADO" in d for d in details))

    def test_bootstrap_layout_and_false_flags(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            sandbox = Path(tmp)
            result = run_flow_smoke.bootstrap(sandbox, "pulse-timer")
            self.assertTrue(result.ok)
            idea = sandbox / "proyectos/app/pulse-timer/idea"
            self.assertTrue((sandbox / "proyectos/app/pulse-timer/audits").is_dir())
            self.assertFalse(run_flow_smoke.any_flag_true(idea))
            self.assertFalse((sandbox / "applications").exists())

    def test_builder_blocked_before_human_gates(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            sandbox = Path(tmp)
            run_flow_smoke.bootstrap(sandbox, "pulse-timer")
            idea = sandbox / "proyectos/app/pulse-timer/idea"
            step = run_flow_smoke.builder_attempt(idea)
        self.assertTrue(step.ok)
        self.assertIn("rechazo correcto", step.detail)


if __name__ == "__main__":
    unittest.main()
