#!/usr/bin/env node
// Contrato: docs/iteration-environment-spec.md — export web estático del prototipo.
// El APK Android se genera en iteraciones vN (construction) con EAS/Gradle, no en prototype.
import { spawnSync } from "node:child_process";
import path from "node:path";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const r = spawnSync(npm, ["run", "export:web"], { stdio: "inherit", shell: process.platform === "win32" });
if (r.status !== 0) process.exit(r.status ?? 1);
console.log(`ARTIFACT_PATH=${path.resolve("dist")}`);
