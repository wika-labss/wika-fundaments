import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { defaultDevCommand, resolveNpmInvocation } from "../src/preview/preview-manager.js";

test("defaultDevCommand usa expo local, no npx", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wika-prev-"));
  fs.mkdirSync(path.join(dir, "node_modules", "expo", "bin"), { recursive: true });
  fs.writeFileSync(path.join(dir, "node_modules", "expo", "bin", "cli"), "");
  const cmd = defaultDevCommand(dir, 4300);
  assert.equal(cmd.command, process.execPath);
  assert.equal(cmd.args[0], path.join(dir, "node_modules", "expo", "bin", "cli"));
  assert.deepEqual(cmd.args.slice(1), ["start", "--web", "--port", "4300"]);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("defaultDevCommand usa vite local", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wika-prev-"));
  fs.mkdirSync(path.join(dir, "node_modules", "vite", "bin"), { recursive: true });
  fs.writeFileSync(path.join(dir, "node_modules", "vite", "bin", "vite.js"), "");
  const cmd = defaultDevCommand(dir, 4301);
  assert.equal(cmd.args[0], path.join(dir, "node_modules", "vite", "bin", "vite.js"));
  assert.ok(cmd.args.includes("127.0.0.1"));
  fs.rmSync(dir, { recursive: true, force: true });
});

test("resolveNpmInvocation no usa shell", () => {
  const npm = resolveNpmInvocation();
  assert.ok(npm.command === process.execPath || npm.command === "npm" || npm.command === "npm.cmd");
  if (npm.command === process.execPath) {
    assert.match(npm.prefix[0] ?? "", /npm-cli\.js$/);
  }
});
