import { useMemo, useState } from "react";
import type { PreviewState } from "@wika-studio/wika-client";

export type DevicePreset = "iphone" | "android" | "tablet" | "desktop";

const PRESETS: Record<DevicePreset, { label: string; w: number; h: number; radius: number }> = {
  iphone: { label: "iPhone", w: 390, h: 844, radius: 36 },
  android: { label: "Android", w: 412, h: 915, radius: 28 },
  tablet: { label: "Tablet", w: 768, h: 1024, radius: 18 },
  desktop: { label: "Escritorio", w: 1100, h: 720, radius: 8 },
};

export function DeviceFrame({
  preview,
  onStart,
  onStop,
  onReload,
}: {
  preview: PreviewState | null;
  onStart: () => void;
  onStop: () => void;
  onReload: () => void;
}) {
  const [preset, setPreset] = useState<DevicePreset>("iphone");
  const [rotated, setRotated] = useState(false);
  const [zoom, setZoom] = useState(0.7);
  const [iframeKey, setIframeKey] = useState(0);

  const dim = PRESETS[preset];
  const width = rotated ? dim.h : dim.w;
  const height = rotated ? dim.w : dim.h;
  const url = preview?.preview_url;

  const statusLabel = useMemo(() => {
    if (!preview) return "detenido";
    return preview.status;
  }, [preview]);

  return (
    <section className="device-panel">
      <div className="device-toolbar">
        <div className="seg">
          {(Object.keys(PRESETS) as DevicePreset[]).map((id) => (
            <button key={id} type="button" className={preset === id ? "active" : ""} onClick={() => setPreset(id)}>
              {PRESETS[id].label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setRotated((r) => !r)} disabled={preset === "desktop"}>
          Rotar
        </button>
        <label className="zoom">
          Zoom
          <input type="range" min={0.4} max={1.1} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
        </label>
        <span className={`badge status-${preview?.status ?? "stopped"}`}>{statusLabel}</span>
        {preview?.status === "ready" || preview?.status === "starting" || preview?.status === "installing" ? (
          <button type="button" onClick={onStop}>
            Detener
          </button>
        ) : (
          <button type="button" onClick={onStart}>
            Levantar preview
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setIframeKey((k) => k + 1);
            onReload();
          }}
        >
          Recargar
        </button>
      </div>

      <div className="device-stage">
        <div
          className={`device-bezel device-${preset}`}
          style={{
            width: width * zoom + 24,
            height: height * zoom + 24,
            borderRadius: dim.radius * zoom,
          }}
        >
          <div className="device-notch" hidden={preset === "desktop" || preset === "tablet"} />
          {url && preview?.status === "ready" ? (
            <iframe
              key={`${iframeKey}-${url}`}
              title="Preview"
              src={url}
              style={{ width, height, transform: `scale(${zoom})`, transformOrigin: "top left" }}
            />
          ) : (
            <div className="device-empty" style={{ width: width * zoom, height: height * zoom }}>
              {preview?.status === "error" ? (
                <p className="error">{preview.last_error ?? "Error al levantar el preview"}</p>
              ) : preview?.status === "installing" || preview?.status === "starting" ? (
                <p>Levantando demo…</p>
              ) : (
                <p>El preview está detenido. Pulsa «Levantar preview».</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
