import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { type StudioConfig, loadConfig, resetConfigForTests } from "../src/config.js";
import { hashPassword } from "../src/auth/owner-auth.js";

export const OWNER_EMAIL = "dueno@wika.test";
export const OWNER_PASSWORD = "clave-segura-123";

export interface TestEnv {
  root: string;
  proyectos: string;
  data: string;
  config: StudioConfig;
}

export function makeTestEnv(overrides: Partial<NodeJS.ProcessEnv> = {}): TestEnv {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wika-studio-"));
  const proyectos = path.join(root, "proyectos");
  const data = path.join(root, "data");
  fs.mkdirSync(path.join(proyectos, "app"), { recursive: true });
  fs.mkdirSync(data, { recursive: true });
  const config = loadConfig({
    ...process.env,
    HOST: "127.0.0.1",
    PORT: "0",
    WIKA_PROYECTOS_ROOT: proyectos,
    STUDIO_DATA_DIR: data,
    STUDIO_OWNERS: OWNER_EMAIL,
    STUDIO_PASSWORD_HASH: hashPassword(OWNER_PASSWORD),
    STUDIO_SESSION_SECRET: "test-secret-32-bytes-long-enough!!",
    STUDIO_AGENT_RUNTIME: "mock",
    CURSOR_API_KEY: "",
    ...overrides,
  });
  resetConfigForTests(config);
  return { root, proyectos, data, config };
}

export function cleanupTestEnv(env: TestEnv): void {
  resetConfigForTests();
  fs.rmSync(env.root, { recursive: true, force: true });
}

export async function listen(app: import("express").Express): Promise<{
  url: string;
  close: () => Promise<void>;
}> {
  const http = await import("node:http");
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  if (!addr || typeof addr === "string") throw new Error("listen failed");
  return {
    url: `http://127.0.0.1:${addr.port}`,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      }),
  };
}

export function cookieFrom(res: Response): string {
  const raw = res.headers.get("set-cookie");
  if (!raw) return "";
  return raw.split(";")[0];
}

export async function login(url: string, email = OWNER_EMAIL, password = OWNER_PASSWORD): Promise<string> {
  const res = await fetch(`${url}/api/v1/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`login ${res.status}: ${await res.text()}`);
  return cookieFrom(res);
}

export function authHeaders(cookie: string): HeadersInit {
  return { cookie, "content-type": "application/json" };
}
