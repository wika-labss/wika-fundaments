console.log(`[bff] node ${process.version} cwd=${process.cwd()}`);

process.on("uncaughtException", (err) => {
  console.error("[bff] uncaughtException", err);
});
process.on("unhandledRejection", (err) => {
  console.error("[bff] unhandledRejection", err);
});

const { getConfig } = await import("./config.js");
const config = getConfig();
console.log(
  `[bff] config host=${config.host} port=${config.port} runtime=${config.runtime} key=${config.cursorApiKey ? "sí" : "no"}`,
);

let runtime;
if (config.runtime === "cursor-sdk" && config.cursorApiKey) {
  console.log("[bff] cargando @cursor/sdk…");
  const { CursorSdkRuntime } = await import("./agents/cursor-sdk-runtime.js");
  runtime = new CursorSdkRuntime(config.cursorApiKey);
} else {
  const { MockRuntime } = await import("./agents/mock-runtime.js");
  runtime = new MockRuntime();
}

const { createApp } = await import("./app.js");
const studio = createApp({ config, runtime });

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

server.on("error", (err) => {
  console.error(`[bff] no pudo escuchar en ${config.host}:${config.port}`, err);
  process.exit(1);
});

async function shutdown(signal: string): Promise<void> {
  console.log(`[bff] ${signal}, cerrando…`);
  await studio.shutdown();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 4000).unref();
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
