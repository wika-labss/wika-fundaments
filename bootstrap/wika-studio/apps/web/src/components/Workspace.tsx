import { useCallback, useEffect, useState } from "react";
import type { AgentId, ModelInfo, Owner, PreviewState, ProjectState, ProjectSummary, SolutionType } from "@wika-studio/wika-client";
import { studioApi } from "../api";
import { AssetPanel } from "./AssetPanel";
import { ChatPanel } from "./ChatPanel";
import { DeviceFrame } from "./DeviceFrame";
import { IterationTimeline } from "./IterationTimeline";

export function Workspace({ owner, onLogout }: { owner: Owner; onLogout: () => void }) {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<ProjectState | null>(null);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [modelId, setModelId] = useState("");
  const [runtime, setRuntime] = useState<string>("");
  const [agentId, setAgentId] = useState<AgentId>("wika-builder");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const iteration = state?.mode === "exploration" ? "prototype" : (state?.iterations?.filter((i) => i !== "prototype").at(-1) ?? "prototype");

  const loadProjects = useCallback(async () => {
    const data = await studioApi.projects();
    setProjects(data.projects);
  }, []);

  useEffect(() => {
    loadProjects().catch((e: Error) => setError(e.message));
    studioApi
      .models()
      .then((m) => {
        setModels(m.models);
        setRuntime(m.runtime);
        if (m.default_model_id) setModelId(m.default_model_id);
        else if (m.models[0]) setModelId(m.models[0].id);
      })
      .catch((e: Error) => setError(e.message));
  }, [loadProjects]);

  useEffect(() => {
    if (!selected) {
      setState(null);
      setSessionId(null);
      setPreview(null);
      return;
    }
    studioApi
      .state(selected)
      .then((s) => {
        setState(s);
        setAgentId((s.suggested_agent as AgentId) || "wika-builder");
      })
      .catch((e: Error) => setError(e.message));
  }, [selected, refresh]);

  useEffect(() => {
    if (!selected || !iteration) return;
    let cancelled = false;
    const tick = () => {
      studioApi
        .preview(selected, iteration)
        .then((p) => {
          if (!cancelled) setPreview(p);
        })
        .catch(() => undefined);
    };
    tick();
    const id = setInterval(tick, 2500);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [selected, iteration]);

  async function onCreate(form: HTMLFormElement) {
    const data = new FormData(form);
    setCreating(true);
    setError(null);
    try {
      const created = await studioApi.createProject({
        project_id: String(data.get("project_id") ?? "").trim(),
        title: String(data.get("title") ?? "").trim(),
        project_mode: data.get("project_mode") === "construction" ? "construction" : "exploration",
        solution_type: (String(data.get("solution_type") ?? "mobile_app") as SolutionType) || "mobile_app",
        problem_statement: String(data.get("problem_statement") ?? "").trim() || undefined,
        owner: owner.email,
      });
      await loadProjects();
      setSelected(created.project.project_id);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear");
    } finally {
      setCreating(false);
    }
  }

  async function changeModel(id: string) {
    setModelId(id);
    try {
      await studioApi.setDefaultModel(id);
    } catch {
      /* el modelo de la sesión igual se usa */
    }
  }

  return (
    <div className="workspace">
      <aside className="sidebar">
        <header className="sidebar-head">
          <div>
            <h1>WIKA Studio</h1>
            <p className="muted">{owner.email}</p>
          </div>
          <button type="button" onClick={() => void studioApi.logout().then(onLogout)}>
            Salir
          </button>
        </header>
        <p className="muted runtime">IA: {runtime || "…"}</p>

        <h2>Proyectos</h2>
        <ul className="projects">
          {projects.map((p) => (
            <li key={p.project_id}>
              <button type="button" className={selected === p.project_id ? "active" : ""} onClick={() => setSelected(p.project_id)}>
                {p.project_id}
                <span className="badge">{p.mode ?? "construction"}</span>
              </button>
            </li>
          ))}
        </ul>

        <form
          className="new-project"
          onSubmit={(e) => {
            e.preventDefault();
            void onCreate(e.currentTarget);
          }}
        >
          <h3>Nuevo proyecto</h3>
          <input name="project_id" placeholder="kebab-case" required />
          <input name="title" placeholder="Título" required />
          <select name="project_mode" defaultValue="exploration">
            <option value="exploration">Exploración (demo en vivo)</option>
            <option value="construction">Construcción</option>
          </select>
          <select name="solution_type" defaultValue="mobile_app">
            <option value="mobile_app">App móvil</option>
            <option value="game">Juego</option>
            <option value="web_app">Web</option>
            <option value="hybrid">Híbrido</option>
          </select>
          <textarea name="problem_statement" rows={3} placeholder="Qué necesita el cliente" />
          <button type="submit" disabled={creating}>
            {creating ? "Creando…" : "Crear y abrir prototipo"}
          </button>
        </form>
      </aside>

      <div className="main-col">
        {error && <p className="error banner">{error}</p>}
        {!selected || !state ? (
          <section className="card empty-main">
            <h2>Elige o crea un proyecto</h2>
            <p>En exploración el agente construye la demo en <code>iterations/prototype/</code> y el preview se recarga solo.</p>
          </section>
        ) : (
          <>
            <header className="project-bar">
              <h2>
                {selected} <span className="badge">{state.mode}</span> <span className="badge">{state.state_id}</span>
              </h2>
              <p className="muted">
                Iteración {iteration} · agente sugerido <code>{state.suggested_agent}</code>
              </p>
            </header>
            <div className="work-grid">
              <ChatPanel
                projectId={selected}
                sessionId={sessionId}
                agentId={agentId}
                modelId={modelId}
                models={models}
                onAgentChange={(id) => {
                  setAgentId(id);
                  setSessionId(null);
                }}
                onModelChange={changeModel}
                onSession={setSessionId}
                onCheckpoint={() => setRefresh((n) => n + 1)}
              />
              <DeviceFrame
                preview={preview}
                onStart={() => void studioApi.startPreview(selected, iteration).then(setPreview).catch((e: Error) => setError(e.message))}
                onStop={() => void studioApi.stopPreview(selected, iteration).then(setPreview)}
                onReload={() => setRefresh((n) => n + 1)}
              />
            </div>
            <div className="bottom-grid">
              <AssetPanel projectId={selected} iteration={iteration} />
              <IterationTimeline
                projectId={selected}
                iteration={iteration}
                refreshToken={refresh}
                onRestored={() => setRefresh((n) => n + 1)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
