import fs from "node:fs";
import path from "node:path";

interface SettingsFile {
  default_model_by_owner: Record<string, string>;
}

/** Preferencias por dueño en `.data/settings.json` (fuera del repo proyectos). */
export class SettingsStore {
  private readonly file: string;

  constructor(dataDir: string) {
    this.file = path.join(dataDir, "settings.json");
  }

  private read(): SettingsFile {
    try {
      return JSON.parse(fs.readFileSync(this.file, "utf8")) as SettingsFile;
    } catch {
      return { default_model_by_owner: {} };
    }
  }

  private write(data: SettingsFile): void {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify(data, null, 2));
  }

  getDefaultModel(owner: string): string | null {
    return this.read().default_model_by_owner[owner] ?? null;
  }

  setDefaultModel(owner: string, modelId: string): void {
    const data = this.read();
    data.default_model_by_owner[owner] = modelId;
    this.write(data);
  }
}
