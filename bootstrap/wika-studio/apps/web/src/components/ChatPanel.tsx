import { useEffect, useRef, useState, type FormEvent } from "react";
import type { AgentId, ModelInfo, SessionEvent } from "@wika-studio/wika-client";
import { CHAT_AGENTS } from "@wika-studio/wika-client";
import { fileToAttachment, studioApi } from "../api";

interface ChatPanelProps {
  projectId: string;
  sessionId: string | null;
  agentId: AgentId;
  modelId: string;
  models: ModelInfo[];
  onAgentChange: (id: AgentId) => void;
  onModelChange: (id: string) => void;
  onSession: (sid: string) => void;
  onCheckpoint: () => void;
}

export function ChatPanel({
  projectId,
  sessionId,
  agentId,
  modelId,
  models,
  onAgentChange,
  onModelChange,
  onSession,
  onCheckpoint,
}: ChatPanelProps) {
  const [events, setEvents] = useState<SessionEvent[]>([]);
  const [draft, setDraft] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveText, setLiveText] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionId) {
      setEvents([]);
      setLiveText("");
      return;
    }
    const es = new EventSource(studioApi.streamUrl(projectId, sessionId), { withCredentials: true });
    es.onmessage = () => undefined;
    const on = (type: SessionEvent["event"]) => (ev: MessageEvent) => {
      const data = JSON.parse(ev.data as string) as SessionEvent["data"];
      if (type === "assistant.delta") {
        setLiveText((t) => t + (data as { text: string }).text);
        return;
      }
      if (type === "assistant.message") setLiveText("");
      if (type === "run.finished") {
        setBusy(false);
        setLiveText("");
      }
      if (type === "checkpoint.created") onCheckpoint();
      setEvents((prev) => [...prev, { event: type, data } as SessionEvent]);
    };
    const types: SessionEvent["event"][] = [
      "user.message",
      "run.started",
      "assistant.delta",
      "assistant.message",
      "tool.call",
      "guard.violation",
      "checkpoint.created",
      "run.finished",
    ];
    for (const t of types) es.addEventListener(t, on(t));
    return () => es.close();
  }, [projectId, sessionId, onCheckpoint]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [events, liveText]);

  async function ensureSession(): Promise<string> {
    if (sessionId) return sessionId;
    const created = await studioApi.createSession(projectId, { agent_id: agentId, model_id: modelId });
    onSession(created.session_id);
    return created.session_id;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim() && images.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const sid = await ensureSession();
      const attachments = await Promise.all(images.map(fileToAttachment));
      await studioApi.sendMessage(projectId, sid, { text: draft, model_id: modelId, images: attachments });
      setDraft("");
      setImages([]);
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "No se pudo enviar");
    }
  }

  return (
    <section className="chat-panel">
      <header className="chat-toolbar">
        <label>
          Agente
          <select value={agentId} onChange={(e) => onAgentChange(e.target.value as AgentId)}>
            {CHAT_AGENTS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <label>
          Modelo
          <select value={modelId} onChange={(e) => onModelChange(e.target.value)}>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.display_name}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="chat-log" ref={scroller}>
        {events.map((ev, i) => (
          <ChatEvent key={`${ev.event}-${i}`} ev={ev} />
        ))}
        {liveText && <pre className="bubble assistant live">{liveText}</pre>}
      </div>

      {error && <p className="error">{error}</p>}

      <form className="chat-composer" onSubmit={onSubmit}>
        <textarea
          rows={3}
          placeholder="Describe la solución: botones, textos, íconos, pantallas…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void onSubmit(e);
            }
          }}
        />
        <div className="composer-row">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files ?? []).slice(0, 5))}
          />
          <button type="submit" disabled={busy}>
            {busy ? "Trabajando…" : "Enviar"}
          </button>
        </div>
        {images.length > 0 && <p className="muted">{images.length} imagen(es) adjunta(s)</p>}
      </form>
    </section>
  );
}

function ChatEvent({ ev }: { ev: SessionEvent }) {
  switch (ev.event) {
    case "user.message":
      return <pre className="bubble user">{ev.data.text}</pre>;
    case "assistant.message":
      return <pre className="bubble assistant">{ev.data.text}</pre>;
    case "tool.call":
      return (
        <p className="muted tool">
          {ev.data.name} {ev.data.status}
          {ev.data.path ? ` · ${ev.data.path}` : ""}
        </p>
      );
    case "guard.violation":
      return (
        <p className="error">
          Bloqueado: {ev.data.path} — {ev.data.reason}
        </p>
      );
    case "checkpoint.created":
      return <p className="muted">Checkpoint {ev.data.checkpoint_id.slice(0, 7)}</p>;
    case "run.finished":
      return (
        <p className="muted">
          Run {ev.data.status}
          {ev.data.usage ? ` · ${ev.data.usage.total_tokens} tokens` : ""}
        </p>
      );
    default:
      return null;
  }
}
