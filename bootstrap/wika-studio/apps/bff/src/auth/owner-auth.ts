import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import type { Owner } from "@wika-studio/wika-client";
import type { StudioConfig } from "../config.js";

export const SESSION_COOKIE = "wika_studio_session";

// ---------------------------------------------------------------------------
// Contraseña: scrypt, formato "scrypt$<salt_hex>$<hash_hex>"

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  const actual = crypto.scryptSync(password, salt, expected.length);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

// ---------------------------------------------------------------------------
// Token de sesión firmado: base64url(payload).base64url(hmac)

interface SessionPayload {
  email: string;
  exp: number;
}

function sign(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

export function createSessionToken(email: string, config: Pick<StudioConfig, "sessionSecret" | "sessionTtlMs">): string {
  const payload: SessionPayload = { email, exp: Date.now() + config.sessionTtlMs };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, config.sessionSecret)}`;
}

export function readSessionToken(token: string | undefined, config: Pick<StudioConfig, "sessionSecret" | "owners">): Owner | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(body, config.sessionSecret);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (typeof payload.email !== "string" || typeof payload.exp !== "number") return null;
    if (payload.exp < Date.now()) return null;
    if (!config.owners.includes(payload.email.toLowerCase())) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    out[part.slice(0, eq).trim()] = decodeURIComponent(part.slice(eq + 1).trim());
  }
  return out;
}

// ---------------------------------------------------------------------------
// Login

export type LoginOutcome =
  | { ok: true; owner: Owner }
  | { ok: false; status: 400 | 401 | 403 | 503; code: string; message: string };

export function attemptLogin(email: unknown, password: unknown, config: StudioConfig): LoginOutcome {
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { ok: false, status: 400, code: "BAD_REQUEST", message: "email y password son obligatorios" };
  }
  if (config.owners.length === 0 || !config.passwordHash) {
    return {
      ok: false,
      status: 503,
      code: "AUTH_NOT_CONFIGURED",
      message: "Configura STUDIO_OWNERS y STUDIO_PASSWORD_HASH en .env (node scripts/hash-password.mjs)",
    };
  }
  const normalized = email.trim().toLowerCase();
  if (!config.owners.includes(normalized)) {
    return { ok: false, status: 403, code: "FORBIDDEN", message: "Este Studio es de uso exclusivo de sus dueños" };
  }
  if (!verifyPassword(password, config.passwordHash)) {
    return { ok: false, status: 401, code: "UNAUTHORIZED", message: "Credenciales inválidas" };
  }
  return { ok: true, owner: { email: normalized } };
}

// ---------------------------------------------------------------------------
// Middleware

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      owner?: Owner;
    }
  }
}

export function requireOwner(config: StudioConfig) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const cookies = parseCookies(req.headers.cookie);
    const owner = readSessionToken(cookies[SESSION_COOKIE], config);
    if (!owner) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Inicia sesión como dueño" } });
      return;
    }
    req.owner = owner;
    next();
  };
}

export function sessionCookieHeader(token: string, config: Pick<StudioConfig, "sessionTtlMs">): string {
  const maxAge = Math.floor(config.sessionTtlMs / 1000);
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

export function clearCookieHeader(): string {
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}
