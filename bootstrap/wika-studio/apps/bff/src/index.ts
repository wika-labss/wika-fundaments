import cors from "cors";
import express from "express";
import type { ProjectState } from "@wika-studio/wika-client";
import {
  listProjects,
  readProjectFlags,
  resolveStateId,
  suggestedAgent,
  validateProjectStructure,
} from "./projects.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok", service: "wika-studio-bff" });
});

app.get("/api/v1/projects", (_req, res) => {
  res.json({ projects: listProjects() });
});

app.get("/api/v1/projects/:id", (req, res) => {
  const flags = readProjectFlags(req.params.id);
  res.json({ project_id: req.params.id, flags });
});

app.get("/api/v1/projects/:id/state", (req, res) => {
  const flags = readProjectFlags(req.params.id);
  const state_id = resolveStateId(flags);
  const body: ProjectState = {
    project_id: req.params.id,
    state_id,
    suggested_agent: suggestedAgent(state_id),
    mode: flags.project_mode ?? "construction",
    flags,
  };
  res.json(body);
});

app.post("/api/v1/projects/:id/validate", (req, res) => {
  const result = validateProjectStructure(req.params.id);
  res.json(result);
});

app.use((_req, res) => {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "ruta no implementada" } });
});

app.listen(port, () => {
  console.log(`wika-studio BFF http://localhost:${port}/api/v1`);
});
