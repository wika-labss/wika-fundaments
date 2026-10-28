#!/usr/bin/env node
// Contrato: docs/iteration-environment-spec.md (wika-fundaments).
// Lanza Expo web en PORT y emite exactamente una línea PREVIEW_URL= cuando responde.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";

const port = Number(process.env.PORT ?? 8081);
const host = "127.0.0.1";
const url = `http://${host}:${port}/`;

function findCli(rels) {
  for (const rel of rels) {
    const p = path.join(process.cwd(), "node_modules", ...rel.split("/"));
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const cli = findCli(["expo/bin/cli", "expo/bin/cli.js"]);
if (!cli) {
  console.error("No se encontró expo en node_modules. Corre npm install en esta carpeta.");
  process.exit(1);
}

const args = [cli, "start", "--web", "--localhost", "--port", String(port)];
if (process.env.WIKA_EXPO_TUNNEL === "1") args.push("--tunnel");

console.log(`[wika-dev] node expo start --web --port ${port}`);
const child = spawn(process.execPath, args, {
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true,
  env: { ...process.env, BROWSER: "none", CI: "1", EXPO_NO_TELEMETRY: "1" },
});
child.stdout?.on("data", (buf) => process.stdout.write(buf));
child.stderr?.on("data", (buf) => process.stderr.write(buf));

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
