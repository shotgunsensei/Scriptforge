import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { listPublicScripts, type ExecutionType, type PublicCatalogSource } from "./catalog";
import type { ScriptSafetyLevel } from "./schema";

export type ScriptIndexEntry = {
  title: string;
  summary: string;
  description: string;
  category: string;
  tags: string[];
  source_type: PublicCatalogSource;
  risk_level: ScriptSafetyLevel;
  execution_type: ExecutionType;
  requires_admin: boolean;
  script_body_excerpt: string;
  slug: string;
  path: string;
};

export type ScriptIndex = {
  generated_at: string;
  count: number;
  scripts: ScriptIndexEntry[];
};

export async function buildScriptIndex(rootDir = process.cwd()): Promise<ScriptIndex> {
  const scripts = await listPublicScripts({}, rootDir);
  const entries = scripts.map((script): ScriptIndexEntry => ({
    title: script.submission.title,
    summary: script.submission.summary,
    description: script.submission.description,
    category: script.category,
    tags: script.submission.tags,
    source_type: script.source,
    risk_level: script.submission.safety.risk_level,
    execution_type: script.execution_type,
    requires_admin: script.submission.safety.requires_admin,
    script_body_excerpt: createScriptExcerpt(script.scriptBody),
    slug: script.slug,
    path: `/scripts/${script.source}/${script.category}/${script.slug}`,
  }));

  return {
    generated_at: new Date().toISOString(),
    count: entries.length,
    scripts: entries,
  };
}

export async function writeScriptIndex(rootDir = process.cwd()): Promise<{ index: ScriptIndex; outputPath: string }> {
  const index = await buildScriptIndex(rootDir);
  const outputPath = join(rootDir, "public", "script-index.json");

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");

  return { index, outputPath };
}

export function createScriptExcerpt(scriptBody: string, maxLength = 500): string {
  const compact = scriptBody.replace(/\s+/g, " ").trim();

  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, maxLength - 3).trim()}...`;
}

async function runCli() {
  const { index, outputPath } = await writeScriptIndex();
  const displayPath = relative(process.cwd(), outputPath) || outputPath;

  process.stdout.write(`Built script index with ${index.count} script(s): ${displayPath}\n`);
}

const currentFile = fileURLToPath(import.meta.url);

if (process.argv[1] && currentFile === process.argv[1]) {
  runCli().catch((error) => {
    const message = error instanceof Error ? error.message : "Failed to build script index.";
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
