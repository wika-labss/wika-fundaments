#!/usr/bin/env node
// Contrato: docs/iteration-environment-spec.md (wika-fundaments).
// Lanza Vite en PORT y emite exactamente una línea PREVIEW_URL= cuando responde.
import { spawn } from "node:child_process";
import http from "node:http";

const port = Number(process.env.PORT ?? 5173);
const host = "127.0.0.1";
const url = `http://localhost:${port}/`;

const bin = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(bin, ["vite", "--host", host, "--port", String(port), "--strictPort", "--clearScreen", "false"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, BROWSER: "none" },
});

let announced = false;
function probe() {
  if (announced) return;
  const req = http.get({ host, port, path: "/", timeout: 1500 }, (res) => {
    res.resume();
    if (!announced && res.statusCode && res.statusCode < 500) {
      announced = true;
      console.log(`PREVIEW_URL=${url}`);
    } else {
      setTimeout(probe, 500);
    }
  });
  req.on("error", () => setTimeout(probe, 500));
  req.on("timeout", () => {
    req.destroy();
    setTimeout(probe, 500);
  });
}
setTimeout(probe, 400);

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    child.kill(sig);
    setTimeout(() => process.exit(0), 300);
  });
}
child.on("exit", (code) => process.exit(code ?? 0));
