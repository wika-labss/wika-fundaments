import { useCallback, useEffect, useState } from "react";
import type { ProjectState, ProjectSummary, ValidateResult } from "@wika-studio/wika-client";

const api = "/api/v1";

export function App() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<ProjectState | null>(null);
  const [validation, setValidation] = useState<ValidateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setError(null);
    const res = await fetch(`${api}/projects`);
    if (!res.ok) throw new Error("No se pudo cargar proyectos");
    const data = (await res.json()) as { projects: ProjectSummary[] };
    setProjects(data.projects);
  }, []);

  const loadState = useCallback(async (id: string) => {
    setError(null);
    const res = await fetch(`${api}/projects/${id}/state`);
    if (!res.ok) throw new Error("No se pudo cargar estado");
    setState((await res.json()) as ProjectState);
  }, []);

  useEffect(() => {
    loadProjects().catch((e: Error) => setError(e.message));
  }, [loadProjects]);

  useEffect(() => {
    if (!selected) {
      setState(null);
      setValidation(null);
      return;
    }
    loadState(selected).catch((e: Error) => setError(e.message));
  }, [selected, loadState]);

  async function onValidate() {
    if (!selected) return;
    const res = await fetch(`${api}/projects/${selected}/validate`, { method: "POST" });
    setValidation((await res.json()) as ValidateResult);
  }

  return (
    <main>
      <header>
        <h1>WIKA Studio</h1>
        <p>Consola operativa (UI-A) — SCOS WIKA</p>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="card">
        <h2>Proyectos</h2>
        {projects.length === 0 ? (
          <p>Sin proyectos. Configura <code>WIKA_PROYECTOS_ROOT</code> o usa fixtures locales.</p>
        ) : (
          <ul className="projects">
            {projects.map((p) => (
              <li key={p.project_id}>
                <a
                  className="project-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelected(p.project_id);
                  }}
                >
                  {p.project_id}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selected && state && (
        <section className="card">
          <h2>
            {selected}{" "}
            <span className="badge">{state.mode}</span>
          </h2>
          <p>
            Estado: <strong>{state.state_id}</strong> — agente sugerido:{" "}
            <code>{state.suggested_agent}</code>
          </p>
          <pre>{JSON.stringify(state.flags, null, 2)}</pre>
          <button type="button" onClick={onValidate}>
            Validar proyecto
          </button>
          {validation && (
            <pre>{validation.ok ? "OK" : "FAIL"}\n{JSON.stringify(validation.findings, null, 2)}</pre>
          )}
        </section>
      )}
    </main>
  );
}
