#!/usr/bin/env node
// Genera el valor de STUDIO_PASSWORD_HASH para .env.
// Uso: node scripts/hash-password.mjs            (pide la contraseña sin eco)
//      node scripts/hash-password.mjs "clave"    (no recomendado: queda en el historial)
import crypto from "node:crypto";
import readline from "node:readline";

function hash(password) {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

async function readHidden(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  const originalWrite = rl._writeToOutput;
  process.stdout.write(prompt);
  rl._writeToOutput = () => {};
  return new Promise((resolve) => {
    rl.question("", (answer) => {
      rl._writeToOutput = originalWrite;
      process.stdout.write("\n");
      rl.close();
      resolve(answer);
    });
  });
}

const fromArg = process.argv[2];
const password = fromArg ?? (await readHidden("Contraseña de dueño: "));
if (!password || password.length < 8) {
  console.error("La contraseña debe tener al menos 8 caracteres.");
  process.exit(1);
}
console.log(`STUDIO_PASSWORD_HASH=${hash(password)}`);
