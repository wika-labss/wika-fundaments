import fs from "node:fs";
import path from "node:path";
import type { AuditEvent, AuditEventType } from "@wika-studio/wika-client";
import { projectDir } from "../projects.js";

/** Append-only `.wika/events.jsonl` por proyecto (docs/audit-event-schema.md). */
export class EventLog {
  constructor(private readonly resolveProjectDir: (projectId: string) => string = projectDir) {}

  private file(projectId: string): string {
    return path.join(this.resolveProjectDir(projectId), ".wika", "events.jsonl");
  }

  append(
    projectId: string,
    type: AuditEventType,
    payload: Record<string, unknown>,
    actor: AuditEvent["actor"] = { kind: "system" },
    correlationId?: string,
  ): AuditEvent {
    const now = new Date();
    const stamp = now.toISOString().replace(/[-:.]/g, "").slice(0, 15);
    const event: AuditEvent = {
      event_id: `evt_${stamp}_${Math.random().toString(36).slice(2, 8)}`,
      occurred_at: now.toISOString(),
      project_id: projectId,
      type,
      actor,
      payload,
      ...(correlationId ? { correlation_id: correlationId } : {}),
    };
    const file = this.file(projectId);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.appendFileSync(file, `${JSON.stringify(event)}\n`);
    return event;
  }

  list(projectId: string, limit = 200): AuditEvent[] {
    const file = this.file(projectId);
    if (!fs.existsSync(file)) return [];
    const lines = fs.readFileSync(file, "utf8").split("\n").filter(Boolean);
    return lines
      .slice(-limit)
      .map((l) => {
        try {
          return JSON.parse(l) as AuditEvent;
        } catch {
          return null;
        }
      })
      .filter((e): e is AuditEvent => e !== null)
      .reverse();
  }
}
