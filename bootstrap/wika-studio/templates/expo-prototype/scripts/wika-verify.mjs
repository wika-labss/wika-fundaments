#!/usr/bin/env node
// Contrato: docs/iteration-environment-spec.md — typecheck + build. Exit 0 = OK.
import { spawnSync } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
for (const script of ["typecheck", "export:web"]) {
  const r = spawnSync(npm, ["run", script], { stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) {
    console.error(`wika-verify: falló "${script}"`);
    process.exit(r.status ?? 1);
  }
}
console.log("wika-verify: OK");
