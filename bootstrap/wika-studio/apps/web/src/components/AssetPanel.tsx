import { useEffect, useState } from "react";
import type { AssetInfo } from "@wika-studio/wika-client";
import { fileToAttachment, studioApi } from "../api";

export function AssetPanel({ projectId, iteration }: { projectId: string; iteration: string }) {
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    try {
      setAssets((await studioApi.assets(projectId, iteration)).assets);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar assets");
    }
  }

  useEffect(() => {
    void reload();
  }, [projectId, iteration]);

  async function onFiles(files: FileList | null) {
    if (!files) return;
    setError(null);
    try {
      for (const file of Array.from(files)) {
        await studioApi.uploadAsset(projectId, iteration, await fileToAttachment(file));
      }
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir");
    }
  }

  return (
    <section className="card">
      <h3>Imágenes</h3>
      <p className="muted">Se guardan en {iteration}/assets y se envían al agente.</p>
      <input type="file" accept="image/*" multiple onChange={(e) => void onFiles(e.target.files)} />
      {error && <p className="error">{error}</p>}
      <ul className="asset-list">
        {assets.map((a) => (
          <li key={a.name}>
            <img src={a.url} alt={a.name} />
            <span>{a.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
