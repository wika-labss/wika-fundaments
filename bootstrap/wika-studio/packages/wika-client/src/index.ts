/** Tipos alineados a wika-fundaments docs/studio-api-contract.md */

export type ProjectMode = "exploration" | "construction";

export interface ProjectSummary {
  project_id: string;
  path: string;
}

export interface ProjectFlags {
  audit_1_passed?: boolean;
  audit_2_passed?: boolean;
  visual_approval_passed?: boolean;
  audit_3_passed?: boolean;
  ready_for_construction?: boolean;
  project_mode?: ProjectMode;
}

export interface ProjectState {
  project_id: string;
  state_id: string;
  suggested_agent: string;
  mode: ProjectMode;
  flags: ProjectFlags;
}

export interface ValidateResult {
  ok: boolean;
  findings: Array<{ path: string; message: string; severity?: string }>;
}

export interface ApiError {
  error: { code: string; message: string };
}
