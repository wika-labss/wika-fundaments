#!/usr/bin/env node
// Escribe STUDIO_OWNERS + STUDIO_PASSWORD_HASH en .env como UTF-8 (sin BOM).
// Evita UTF-16 de Notepad/PowerShell, que rompe el login.
//
//   node scripts/write-owner-env.mjs --email tu@correo --password "tu-clave"
//   node scripts/write-owner-env.mjs --email tu@correo --password "tu-clave" --key cursor_xxx
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");
const examplePath = path.join(root, ".env.example");

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1 || !process.argv[i + 1]) return null;
  return process.argv[i + 1];
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

function readEnvText(file) {
  const buf = fs.readFileSync(file);
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) return buf.toString("utf16le");
  if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) {
    return Buffer.from(buf.swap16()).toString("utf16le");
  }
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    return buf.toString("utf8").slice(1);
  }
  return buf.toString("utf8");
}

function parseEnv(text) {
  const out = new Map();
  for (const raw of text.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    if (line.startsWith("export ")) line = line.slice(7).trim();
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    out.set(line.slice(0, eq).trim(), line.slice(eq + 1).trim());
  }
  return out;
}

const email = arg("email");
const password = arg("password");
const key = arg("key");
if (!email || !password) {
  console.error('Uso: node scripts/write-owner-env.mjs --email tu@correo --password "tu-clave"');
  process.exit(1);
}
if (password.length < 8) {
  console.error("La contraseña debe tener al menos 8 caracteres.");
  process.exit(1);
}

const existing = fs.existsSync(envPath)
  ? parseEnv(readEnvText(envPath))
  : fs.existsSync(examplePath)
    ? parseEnv(readEnvText(examplePath))
    : new Map();

existing.set("STUDIO_OWNERS", email.trim().toLowerCase());
existing.set("STUDIO_PASSWORD_HASH", hashPassword(password));
if (key) existing.set("CURSOR_API_KEY", key.trim());

const lines = [
  "# WIKA Studio — generado por scripts/write-owner-env.mjs (UTF-8)",
  `STUDIO_OWNERS=${existing.get("STUDIO_OWNERS")}`,
  `STUDIO_PASSWORD_HASH=${existing.get("STUDIO_PASSWORD_HASH")}`,
  `CURSOR_API_KEY=${existing.get("CURSOR_API_KEY") ?? ""}`,
];
for (const [k, v] of existing) {
  if (["STUDIO_OWNERS", "STUDIO_PASSWORD_HASH", "CURSOR_API_KEY"].includes(k)) continue;
  if (k.startsWith("#")) continue;
  lines.push(`${k}=${v}`);
}

fs.writeFileSync(envPath, `${lines.join("\n")}\n`, { encoding: "utf8" });
console.log(`Escrito ${envPath} (UTF-8)`);
console.log(`Dueño: ${email.trim().toLowerCase()}`);
console.log("Reinicia npm run dev y entra con ese correo y esa contraseña.");
