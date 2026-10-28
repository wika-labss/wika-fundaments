import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, test } from "node:test";
import { createApp } from "../src/app.js";
import { MockRuntime } from "../src/agents/mock-runtime.js";
import { hashPassword, sanitizePasswordHash, verifyPassword } from "../src/auth/owner-auth.js";
import { readEnvText } from "../src/config.js";
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

test("verifyPassword tolera hash pegado con prefijo y retorno de carro", () => {
  const hash = hashPassword("clave-segura-123");
  const dirty = `STUDIO_PASSWORD_HASH=${hash}\r`;
  assert.equal(sanitizePasswordHash(dirty), hash);
  assert.equal(verifyPassword("clave-segura-123", dirty), true);
  assert.equal(verifyPassword("otra", hash), false);
});

test("login con hash basura responde 401, no 500", async () => {
  cleanupTestEnv(env);
  env = makeTestEnv({ STUDIO_PASSWORD_HASH: "no-es-un-hash" });
  const studio = createApp({ config: env.config, runtime: new MockRuntime(0), log: () => undefined });
  const { url, close } = await listen(studio.app);
  try {
    const res = await fetch(`${url}/api/v1/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: OWNER_EMAIL, password: OWNER_PASSWORD }),
    });
    assert.equal(res.status, 401);
    const body = (await res.json()) as { error: { code: string } };
    assert.equal(body.error.code, "UNAUTHORIZED");
  } finally {
    await studio.shutdown();
    await close();
  }
});

test("readEnvText lee .env UTF-16 LE de Windows", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wika-env-"));
  const file = path.join(dir, ".env");
  const text = "STUDIO_OWNERS=dueno@wika.test\nSTUDIO_PASSWORD_HASH=scrypt$aa$bb\n";
  fs.writeFileSync(file, Buffer.from(`\uFEFF${text}`, "utf16le"));
  const parsed = readEnvText(file);
  assert.match(parsed, /STUDIO_OWNERS=dueno@wika.test/);
  fs.rmSync(dir, { recursive: true, force: true });
});
