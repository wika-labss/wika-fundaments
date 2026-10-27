import assert from "node:assert/strict";
import { test } from "node:test";
import { GateGuard, globToRegExp, matchesAny } from "../src/agents/gate-guard.js";
import { getAgentSpec } from "../src/agents/catalog.js";

test("wika-builder sobre vN exige ready_for_construction", () => {
  const spec = getAgentSpec("wika-builder");
  const blocked = spec.precondition({
    mode: "construction",
    iteration: "v1",
    flags: { ready_for_construction: false },
  });
  assert.ok(blocked);
  assert.equal(blocked?.missing_flag, "ready_for_construction");

  const ok = spec.precondition({
    mode: "exploration",
    iteration: "prototype",
    flags: { ready_for_construction: false },
  });
  assert.equal(ok, null);
});

test("postcheck revierte flags y archivos fuera de ruta", () => {
  const guard = new GateGuard();
  const before = new Map<string, string | null>([
    ["idea/05-build-plan.md", "---\nready_for_construction: false\n---\n"],
  ]);
  const after: Record<string, string | null> = {
    "idea/05-build-plan.md": "---\nready_for_construction: true\n---\n",
    "final/hack.txt": "no",
    "iterations/prototype/src/App.tsx": "ok",
  };
  const outOfPath = guard.postcheck(
    ["final/hack.txt", "iterations/prototype/src/App.tsx"],
    ["iterations/prototype/**"],
    before,
    (p) => after[p] ?? null,
  );
  assert.equal(outOfPath.length, 1);
  assert.equal(outOfPath[0].path, "final/hack.txt");

  const flags = guard.postcheck(
    ["idea/05-build-plan.md"],
    ["idea/**"],
    before,
    (p) => after[p] ?? null,
  );
  assert.equal(flags.length, 1);
  assert.match(flags[0].reason, /ready_for_construction/);
});

test("glob ** cubre subrutas", () => {
  assert.ok(matchesAny("iterations/prototype/src/App.tsx", ["iterations/prototype/**"]));
  assert.ok(!matchesAny("final/x.txt", ["iterations/prototype/**"]));
  assert.ok(globToRegExp("idea/**").test("idea/01-problem.md"));
});
