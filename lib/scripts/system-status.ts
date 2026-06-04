import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import packageJson from "../../package.json";
import { listPublicScripts } from "./catalog";
import { listPendingCommunityScripts } from "./review";
import { getScriptStorageDriverName } from "./storage";
import { checkSupabaseConnection, createSupabaseServiceClient, getSupabaseConfig } from "./supabase";

export type ScriptForgeSystemStatus = {
  scriptsIndexed: number;
  pendingReviews: number;
  communityUploads: number;
  storageDriver: string;
  buildVersion: string;
  healthStatus: "healthy" | "degraded";
  healthMessage: string;
  lastIndexRebuild: string | null;
  indexOk: boolean;
  databaseOk: boolean | null;
  productionLocalStorageWarning: boolean;
};

export async function getScriptForgeSystemStatus(rootDir = process.cwd()): Promise<ScriptForgeSystemStatus> {
  const storageDriver = getScriptStorageDriverName();
  const [index, pendingReviews, communityUploads, database] = await Promise.all([
    readIndexStatus(rootDir),
    readPendingReviewCount(rootDir),
    readCommunityUploadCount(rootDir),
    readDatabaseStatus(storageDriver),
  ]);
  const databaseOk = database.skipped ? null : database.ok;
  const healthStatus = index.ok && database.ok ? "healthy" : "degraded";
  const failedMessage = !index.ok ? index.message : !database.ok ? database.message : undefined;

  return {
    scriptsIndexed: index.count,
    pendingReviews,
    communityUploads,
    storageDriver,
    buildVersion: packageJson.version,
    healthStatus,
    healthMessage: healthStatus === "healthy" ? "All visible system checks passed." : failedMessage ?? "One or more checks failed.",
    lastIndexRebuild: index.generatedAt,
    indexOk: index.ok,
    databaseOk,
    productionLocalStorageWarning:
      process.env.NODE_ENV === "production" && storageDriver === "local",
  };
}

async function readIndexStatus(rootDir: string) {
  try {
    const raw = await readFile(join(rootDir, "public", "script-index.json"), "utf8");
    const parsed = JSON.parse(raw) as { generated_at?: string; count?: number };

    return {
      ok: typeof parsed.count === "number",
      count: parsed.count ?? 0,
      generatedAt: parsed.generated_at ?? null,
      message: typeof parsed.count === "number" ? undefined : "Script index is missing count metadata.",
    };
  } catch (error) {
    return {
      ok: false,
      count: 0,
      generatedAt: null,
      message: error instanceof Error ? error.message : "Unable to read script index.",
    };
  }
}

async function readPendingReviewCount(rootDir: string) {
  try {
    return (await listPendingCommunityScripts(rootDir)).length;
  } catch {
    return 0;
  }
}

async function readCommunityUploadCount(rootDir: string) {
  if (getScriptStorageDriverName() === "database" && rootDir === process.cwd()) {
    try {
      const { count, error } = await createSupabaseServiceClient()
        .from("script_submissions")
        .select("id", { count: "exact", head: true })
        .eq("source_type", "community");

      if (error) {
        return 0;
      }

      return count ?? 0;
    } catch {
      return 0;
    }
  }

  const pending = await countDirectoryEntries(join(rootDir, "content", "pending-community-scripts"));
  const approved = (await listPublicScripts({ source: "community" }, rootDir).catch(() => [])).length;

  return pending + approved;
}

async function readDatabaseStatus(storageDriver: string) {
  if (storageDriver !== "database") {
    return {
      ok: true,
      skipped: true,
      message: "Database check skipped for local storage driver.",
    };
  }

  try {
    await checkSupabaseConnection();

    return {
      ok: true,
      skipped: false,
      message: `Supabase connected. Bucket: ${getSupabaseConfig().bucket}.`,
    };
  } catch (error) {
    return {
      ok: false,
      skipped: false,
      message: error instanceof Error ? error.message : "Supabase database check failed.",
    };
  }
}

async function countDirectoryEntries(path: string) {
  try {
    return (await readdir(path)).length;
  } catch {
    return 0;
  }
}
