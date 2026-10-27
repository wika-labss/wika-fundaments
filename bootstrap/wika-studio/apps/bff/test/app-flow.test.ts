import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { afterEach, test } from "node:test";
import { createApp } from "../src/app.js";
import { MockRuntime } from "../src/agents/mock-runtime.js";
import { authHeaders, cleanupTestEnv, listen, login, makeTestEnv } from "./helpers.js";

let env = makeTestEnv();
afterEach(() => {
  cleanupTestEnv(env);
  env = makeTestEnv();
});

async function waitForRun(url: string, cookie: string, projectId: string, sessionId: string, timeoutMs = 8000): Promise<void> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const res = await fetch(`${url}/api/v1/projects/${projectId}/sessions/${sessionId}`, { headers: authHeaders(cookie) });
    const body = (await res.json()) as { history: Array<{ event: string; data?: { status?: string } }>; active_run_id: string | null };
    const finished = body.history.find((e) => e.event === "run.finished");
    if (finished) {
      if (finished.data?.status === "failed") throw new Error(`run failed: ${JSON.stringify(finished)}`);
      return;
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error("timeout esperando run.finished");
}

test("flujo MVP: crear proyecto exploration, chat builder, checkpoint y guarda", async () => {
  const studio = createApp({ config: env.config, runtime: new MockRuntime(5), log: () => undefined });
  const { url, close } = await listen(studio.app);
  try {
    const cookie = await login(url);

    const created = await fetch(`${url}/api/v1/projects`, {
      method: "POST",
      headers: authHeaders(cookie),
      body: JSON.stringify({
        project_id: "demo-cliente",
        title: "Demo Cliente",
        project_mode: "exploration",
        solution_type: "web_app",
        problem_statement: "Una tienda simple",
      }),
    });
    assert.equal(created.status, 201, await created.text());

    const screen = path.join(env.proyectos, "app", "demo-cliente", "iterations", "prototype", "src", "App.tsx");
    assert.ok(fs.existsSync(screen), "plantilla web copiada");

    const sessionRes = await fetch(`${url}/api/v1/projects/demo-cliente/sessions`, {
      method: "POST",
      headers: authHeaders(cookie),
      body: JSON.stringify({ agent_id: "wika-builder" }),
    });
    const sessionBody = await sessionRes.text();
    assert.equal(sessionRes.status, 201, sessionBody);
    const session = JSON.parse(sessionBody) as { session_id: string };

    const msg = await fetch(`${url}/api/v1/projects/demo-cliente/sessions/${session.session_id}/messages`, {
      method: "POST",
      headers: authHeaders(cookie),
      body: JSON.stringify({ text: 'agrega un botón rojo con el texto "Comprar" y un ícono de carrito' }),
    });
    const msgBody = await msg.text();
    assert.equal(msg.status, 202, msgBody);
    await waitForRun(url, cookie, "demo-cliente", session.session_id);

    const after = fs.readFileSync(screen, "utf8");
    assert.match(after, /Comprar/);
    assert.match(after, /danger|🛒/);

    const cps = await fetch(`${url}/api/v1/projects/demo-cliente/checkpoints`, { headers: authHeaders(cookie) });
    const list = (await cps.json()) as { checkpoints: Array<{ checkpoint_id: string; summary: string }> };
    assert.ok(list.checkpoints.length >= 1, "debe haber al menos un checkpoint");

    const violate = await fetch(`${url}/api/v1/projects/demo-cliente/sessions/${session.session_id}/messages`, {
      method: "POST",
      headers: authHeaders(cookie),
      body: JSON.stringify({ text: "[[violar]] intenta activar flags" }),
    });
    assert.equal(violate.status, 202);
    await waitForRun(url, cookie, "demo-cliente", session.session_id);

    const detail = await fetch(`${url}/api/v1/projects/demo-cliente/sessions/${session.session_id}`, {
      headers: authHeaders(cookie),
    });
    const sess = (await detail.json()) as { history: Array<{ event: string }> };
    assert.ok(sess.history.some((e) => e.event === "guard.violation"), "GateGuard debe emitir guard.violation");

    const flags = fs.readFileSync(path.join(env.proyectos, "app", "demo-cliente", "idea", "05-build-plan.md"), "utf8");
    assert.match(flags, /ready_for_construction:\s*false/);
    assert.ok(!fs.existsSync(path.join(env.proyectos, "app", "demo-cliente", "final", "hack.txt")));

    const first = list.checkpoints[0];
    const restore = await fetch(`${url}/api/v1/projects/demo-cliente/checkpoints/${first.checkpoint_id}/restore`, {
      method: "POST",
      headers: authHeaders(cookie),
      body: JSON.stringify({ paths: ["iterations/prototype"] }),
    });
    assert.ok(restore.ok, await restore.text());
  } finally {
    await studio.shutdown();
    await close();
  }
});

test("wika-builder sobre v1 sin ready_for_construction → 409 GATE_BLOCKED", async () => {
  const studio = createApp({ config: env.config, runtime: new MockRuntime(0), log: () => undefined });
  const { url, close } = await listen(studio.app);
  try {
    const cookie = await login(url);
    await fetch(`${url}/api/v1/projects`, {
      method: "POST",
      headers: authHeaders(cookie),
      body: JSON.stringify({
        project_id: "gate-test",
        title: "Gate",
        project_mode: "construction",
        solution_type: "mobile_app",
      }),
    });
    fs.mkdirSync(path.join(env.proyectos, "app", "gate-test", "iterations", "v1"), { recursive: true });
    const session = await fetch(`${url}/api/v1/projects/gate-test/sessions`, {
      method: "POST",
      headers: authHeaders(cookie),
      body: JSON.stringify({ agent_id: "wika-builder", iteration: "v1" }),
    });
    assert.equal(session.status, 409);
    const body = (await session.json()) as { error: { code: string } };
    assert.equal(body.error.code, "GATE_BLOCKED");
  } finally {
    await studio.shutdown();
    await close();
  }
});
