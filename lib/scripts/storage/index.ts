import { DatabaseScriptStorage } from "./databaseStorage";
import { LocalScriptStorage } from "./localStorage";
import type { ScriptStorage, ScriptStorageDriverName } from "./types";

export function getScriptStorage(rootDir = process.cwd()): ScriptStorage {
  const driver = getScriptStorageDriverName();

  if (driver === "database") {
    return new DatabaseScriptStorage();
  }

  return new LocalScriptStorage(rootDir);
}

export function getScriptStorageDriverName(): ScriptStorageDriverName {
  const configured = process.env.SCRIPT_STORAGE_DRIVER;

  return configured === "database" ? "database" : "local";
}
