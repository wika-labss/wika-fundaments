import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { createApp } from "../src/app.js";
import { MockRuntime } from "../src/agents/mock-runtime.js";
import { cleanupTestEnv, cookieFrom, listen, makeTestEnv, OWNER_EMAIL, OWNER_PASSWORD } from "./helpers.js";

let env = makeTestEnv();
afterEach(() => {
  cleanupTestEnv(env);
  env = makeTestEnv();
});

test("dueño inicia sesión; extraño recibe 403; sin sesión 401", async () => {
  const studio = createApp({ config: env.config, runtime: new MockRuntime(0), log: () => undefined });
  const { url, close } = await listen(studio.app);
  try {
    const denied = await fetch(`${url}/api/v1/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "intruso@example.com", password: OWNER_PASSWORD }),
    });
    assert.equal(denied.status, 403);
    const body = (await denied.json()) as { error: { code: string } };
    assert.equal(body.error.code, "FORBIDDEN");

    const bad = await fetch(`${url}/api/v1/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: OWNER_EMAIL, password: "incorrecta" }),
    });
    assert.equal(bad.status, 401);

    const ok = await fetch(`${url}/api/v1/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: OWNER_EMAIL, password: OWNER_PASSWORD }),
    });
    assert.equal(ok.status, 200);
    const cookie = cookieFrom(ok);
    assert.match(cookie, /wika_studio_session=/);

    const me = await fetch(`${url}/api/v1/auth/me`, { headers: { cookie } });
    assert.equal(me.status, 200);

    const anon = await fetch(`${url}/api/v1/projects`);
    assert.equal(anon.status, 401);
  } finally {
    await studio.shutdown();
    await close();
  }
});
