import type { ScriptSubmission } from "../schema";

export type ScriptStorageDriverName = "local" | "database";

export type ScriptAuditEventType =
  | "submission_created"
  | "safety_scan_completed"
  | "script_approved"
  | "script_rejected"
  | "script_marked_needs_changes"
  | "script_promoted_to_official"
  | "script_updated"
  | "admin_seeded";

export type ScriptStorageRecord = {
  submission: ScriptSubmission;
  scriptBody: string;
  scriptExtension: ".ps1" | ".psm1";
  folderPath?: string;
  reviewerNotes?: string;
};

export type ScriptStorageWriteResult = {
  submission: ScriptSubmission;
  folderPath: string;
  files: {
    script: string;
    metadata: string;
    readme: string;
  };
};

export type ScriptAuditEvent = {
  type: ScriptAuditEventType;
  slug: string;
  sourceType: ScriptSubmission["source_type"];
  reviewStatus: ScriptSubmission["review_status"];
  actor?: string | null;
  notes?: string;
  createdAt: string;
};

export type ScriptVersionSnapshot = {
  slug: string;
  sourceType: ScriptSubmission["source_type"];
  version: string;
  scriptBody: string;
  metadata: ScriptSubmission;
  createdBy?: string | null;
  createdAt: string;
};

export interface ScriptStorage {
  createPendingCommunity(record: ScriptStorageRecord): Promise<ScriptStorageWriteResult>;
  saveCommunityApproved(record: ScriptStorageRecord): Promise<ScriptStorageWriteResult>;
  saveOperatorOsDraft(record: ScriptStorageRecord): Promise<ScriptStorageWriteResult>;
  saveOperatorOsApproved(record: ScriptStorageRecord): Promise<ScriptStorageWriteResult>;
  appendAuditEvent(event: ScriptAuditEvent): Promise<void>;
  appendVersionSnapshot(snapshot: ScriptVersionSnapshot): Promise<void>;
}
