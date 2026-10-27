#!/usr/bin/env node
// Contrato: docs/iteration-environment-spec.md (wika-fundaments).
// Lanza Expo web en PORT y emite exactamente una línea PREVIEW_URL= cuando responde.
// Con WIKA_EXPO_TUNNEL=1 agrega --tunnel para probar en un celular real (Expo Go).
import { spawn } from "node:child_process";
import http from "node:http";

const port = Number(process.env.PORT ?? 8081);
const host = "127.0.0.1";
const url = `http://localhost:${port}/`;

const args = ["expo", "start", "--web", "--port", String(port)];
if (process.env.WIKA_EXPO_TUNNEL === "1") args.push("--tunnel");

const bin = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(bin, args, {
  stdio: ["ignore", "inherit", "inherit"],
  shell: process.platform === "win32",
  env: { ...process.env, BROWSER: "none", CI: "1", EXPO_NO_TELEMETRY: "1" },
});

let announced = false;
function probe() {
  if (announced) return;
  const req = http.get({ host, port, path: "/", timeout: 2000 }, (res) => {
    res.resume();
    if (!announced && res.statusCode && res.statusCode < 500) {
      announced = true;
      console.log(`PREVIEW_URL=${url}`);
    } else {
      setTimeout(probe, 800);
    }
  });
  req.on("error", () => setTimeout(probe, 800));
  req.on("timeout", () => {
    req.destroy();
    setTimeout(probe, 800);
  });
}
setTimeout(probe, 1500);

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    child.kill(sig);
    setTimeout(() => process.exit(0), 300);
  });
}
child.on("exit", (code) => process.exit(code ?? 0));
