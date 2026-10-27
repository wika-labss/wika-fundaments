import { Router } from "express";
import type { StudioConfig } from "../config.js";
import {
  attemptLogin,
  clearCookieHeader,
  createSessionToken,
  parseCookies,
  readSessionToken,
  SESSION_COOKIE,
  sessionCookieHeader,
} from "./owner-auth.js";

export function authRouter(config: StudioConfig): Router {
  const router = Router();

  router.post("/login", (req, res) => {
    const body = (req.body ?? {}) as { email?: unknown; password?: unknown };
    const outcome = attemptLogin(body.email, body.password, config);
    if (!outcome.ok) {
      res.status(outcome.status).json({ error: { code: outcome.code, message: outcome.message } });
      return;
    }
    const token = createSessionToken(outcome.owner.email, config);
    res.setHeader("Set-Cookie", sessionCookieHeader(token, config));
    res.json({ owner: outcome.owner });
  });

  router.post("/logout", (_req, res) => {
    res.setHeader("Set-Cookie", clearCookieHeader());
    res.status(204).end();
  });

  router.get("/me", (req, res) => {
    const owner = readSessionToken(parseCookies(req.headers.cookie)[SESSION_COOKIE], config);
    if (!owner) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Sin sesión" } });
      return;
    }
    res.json({ owner });
  });

  return router;
}
