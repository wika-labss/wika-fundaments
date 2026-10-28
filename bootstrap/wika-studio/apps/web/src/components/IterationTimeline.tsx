import { useEffect, useState } from "react";
import type { Checkpoint } from "@wika-studio/wika-client";
import { studioApi } from "../api";

export function IterationTimeline({
  projectId,
  iteration,
  refreshToken,
  onRestored,
}: {
  projectId: string;
  iteration: string;
  refreshToken: number;
  onRestored: () => void;
}) {
  const [items, setItems] = useState<Checkpoint[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    studioApi
      .checkpoints(projectId)
      .then((r) => setItems(r.checkpoints))
      .catch((err: Error) => setError(err.message));
  }, [projectId, refreshToken]);

  async function restore(cid: string) {
    setBusy(cid);
    setError(null);
    try {
      await studioApi.restore(projectId, cid, [`iterations/${iteration}`]);
      onRestored();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo restaurar");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="card">
      <h3>Checkpoints</h3>
      {error && <p className="error">{error}</p>}
      {items.length === 0 ? (
        <p className="muted">Aún no hay checkpoints.</p>
      ) : (
        <ol className="timeline">
          {items.map((c) => (
            <li key={c.checkpoint_id}>
              <div>
                <strong>{c.summary}</strong>
                <span className="muted">
                  {new Date(c.created_at).toLocaleString()} · {c.files_changed} archivos
                  {c.agent_id ? ` · ${c.agent_id}` : ""}
                  {c.model_id ? ` · ${c.model_id}` : ""}
                </span>
              </div>
              <button type="button" disabled={busy === c.checkpoint_id} onClick={() => void restore(c.checkpoint_id)}>
                Restaurar
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
