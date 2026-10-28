import { createApp } from "./app.js";
import { getConfig } from "./config.js";

const config = getConfig();
const studio = createApp({ config });

const server = studio.app.listen(config.port, config.host, () => {
  const where = `http://${config.host}:${config.port}/api/v1`;
  console.log(`wika-studio BFF ${where}`);
  console.log(`  runtime: ${studio.services.runtime.kind}`);
  console.log(`  cursor_key: ${config.cursorApiKey ? "sí" : "no"}`);
  console.log(`  proyectos: ${config.proyectosRoot}`);
  console.log(`  fundaments: ${config.fundamentsRoot ?? "(no detectado)"}`);
  console.log(`  owners: ${config.owners.length}  hash: ${config.passwordHash ? "sí" : "no"}`);
  if (config.owners.length === 0 || !config.passwordHash) {
    console.warn("  auth: STUDIO_OWNERS / STUDIO_PASSWORD_HASH no configurados — el login devolverá 503");
  }
});

async function shutdown(signal: string): Promise<void> {
  console.log(`[bff] ${signal}, cerrando…`);
  await studio.shutdown();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 4000).unref();
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
