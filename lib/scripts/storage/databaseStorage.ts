import type {
  ScriptAuditEvent,
  ScriptStorage,
  ScriptStorageRecord,
  ScriptStorageWriteResult,
  ScriptVersionSnapshot,
} from "./types";

export class DatabaseScriptStorage implements ScriptStorage {
  constructor(private readonly databaseUrl = process.env.DATABASE_URL ?? "") {}

  createPendingCommunity(_record: ScriptStorageRecord): Promise<ScriptStorageWriteResult> {
    return this.notImplemented();
  }

  saveOperatorOsDraft(_record: ScriptStorageRecord): Promise<ScriptStorageWriteResult> {
    return this.notImplemented();
  }

  saveOperatorOsApproved(_record: ScriptStorageRecord): Promise<ScriptStorageWriteResult> {
    return this.notImplemented();
  }

  appendAuditEvent(_event: ScriptAuditEvent): Promise<void> {
    return this.notImplemented();
  }

  appendVersionSnapshot(_snapshot: ScriptVersionSnapshot): Promise<void> {
    return this.notImplemented();
  }

  private async notImplemented(): Promise<never> {
    if (!this.databaseUrl) {
      throw new Error("DATABASE_URL is required when SCRIPT_STORAGE_DRIVER=database.");
    }

    throw new Error("DatabaseScriptStorage is a production placeholder. Apply migrations and implement query adapter before enabling.");
  }
}
