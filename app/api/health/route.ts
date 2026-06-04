import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import packageJson from "../../../package.json";
import { getScriptStorageDriverName } from "../../../lib/scripts/storage";
import { checkSupabaseConnection, getSupabaseConfig } from "../../../lib/scripts/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const storageDriver = getScriptStorageDriverName();
  const [database, index] = await Promise.all([checkDatabase(storageDriver), checkIndex()]);
  const status = database.ok && index.ok ? 200 : 503;

  return NextResponse.json(
    {
      ok: status === 200,
      app: "operatoros-scriptforge",
      version: packageJson.version,
      domain: "scripts.operatoros.net",
      storage_driver: storageDriver,
      supabase_bucket: getSupabaseConfig().bucket,
      database,
      index,
    },
    { status },
  );
}

async function checkDatabase(storageDriver: string) {
  if (storageDriver !== "database") {
    return {
      ok: true,
      mode: "skipped",
      message: "Database check skipped for local storage driver.",
    };
  }

  try {
    await checkSupabaseConnection();

    return {
      ok: true,
      mode: "supabase",
    };
  } catch (error) {
    return {
      ok: false,
      mode: "supabase",
      message: error instanceof Error ? error.message : "Database check failed.",
    };
  }
}

async function checkIndex() {
  try {
    const raw = await readFile(join(process.cwd(), "public", "script-index.json"), "utf8");
    const parsed = JSON.parse(raw) as { generated_at?: string; count?: number };

    return {
      ok: typeof parsed.count === "number",
      generated_at: parsed.generated_at ?? null,
      count: parsed.count ?? 0,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Index check failed.",
    };
  }
}
