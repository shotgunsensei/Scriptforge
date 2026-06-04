import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { scriptSubmissionSchema, type ScriptSubmission } from "./schema";

export type PublicCatalogSource = "operatoros" | "community";
export type PublicSourceFilter = PublicCatalogSource | "official" | "all";
export type ExecutionType = "local" | "admin" | "network" | "destructive" | "policy";

export type PublicScriptCatalogItem = {
  source: PublicCatalogSource;
  official: boolean;
  category: string;
  slug: string;
  scriptPath: string;
  metadataPath: string;
  scriptBody: string;
  execution_type: ExecutionType;
  submission: ScriptSubmission;
};

export type ScriptCatalogFilters = {
  search?: string;
  category?: string;
  tag?: string;
  risk?: string;
  executionType?: string;
  requiresAdmin?: boolean;
  source?: PublicSourceFilter;
};

const CATALOG_SOURCES: PublicCatalogSource[] = ["operatoros", "community"];
const SCRIPT_EXTENSIONS = [".ps1", ".psm1"] as const;

export async function listPublicScripts(
  filters: ScriptCatalogFilters = {},
  rootDir = process.cwd(),
): Promise<PublicScriptCatalogItem[]> {
  const allScripts = (await Promise.all(CATALOG_SOURCES.map((source) => readSourceCatalog(source, rootDir)))).flat();

  return allScripts
    .filter((script) => matchesFilters(script, filters))
    .sort((left, right) => left.submission.title.localeCompare(right.submission.title));
}

export async function getPublicScript(
  source: string,
  category: string,
  slug: string,
  rootDir = process.cwd(),
): Promise<PublicScriptCatalogItem | null> {
  if (source !== "operatoros" && source !== "community") {
    return null;
  }

  const script = await readCatalogScript(source, category, slug, rootDir);

  if (!script || !isPubliclyVisible(script.submission)) {
    return null;
  }

  return script;
}

export async function getCatalogFacets(rootDir = process.cwd()) {
  const scripts = await listPublicScripts({}, rootDir);

  return {
    categories: Array.from(new Set(scripts.map((script) => script.category))).sort(),
    tags: Array.from(new Set(scripts.flatMap((script) => script.submission.tags))).sort(),
    risks: Array.from(new Set(scripts.map((script) => script.submission.safety.risk_level))).sort(),
    executionTypes: Array.from(new Set(scripts.map((script) => script.execution_type))).sort(),
  };
}

export async function getRelatedScripts(
  script: PublicScriptCatalogItem,
  rootDir = process.cwd(),
): Promise<PublicScriptCatalogItem[]> {
  const scripts = await listPublicScripts({}, rootDir);
  const tags = new Set(script.submission.tags);

  return scripts
    .filter((candidate) => candidate.slug !== script.slug || candidate.source !== script.source)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.category === script.category ? 2 : 0) +
        candidate.submission.tags.filter((tag) => tags.has(tag)).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 4)
    .map((entry) => entry.candidate);
}

export function deriveExecutionType(submission: ScriptSubmission): ExecutionType {
  if (submission.safety.touches_filesystem || submission.safety.risk_flags.includes("destructive_filesystem")) {
    return "destructive";
  }

  if (submission.safety.risk_flags.includes("policy_change")) {
    return "policy";
  }

  if (submission.safety.requires_admin) {
    return "admin";
  }

  if (submission.safety.touches_network || submission.safety.risk_flags.includes("remote_network")) {
    return "network";
  }

  return "local";
}

export function formatSourceLabel(source: PublicCatalogSource): string {
  return source === "operatoros" ? "Official OperatorOS" : "Community";
}

export function getScriptDetailHref(script: PublicScriptCatalogItem): string {
  return `/scripts/${script.source}/${script.category}/${script.slug}`;
}

async function readSourceCatalog(source: PublicCatalogSource, rootDir: string): Promise<PublicScriptCatalogItem[]> {
  const sourceDir = join(rootDir, "content", "scripts", source);
  const categories = await readDirectorySafe(sourceDir);
  const categoryScripts = await Promise.all(
    categories.map(async (category) => {
      const categoryDir = join(sourceDir, category);
      const slugs = await readDirectorySafe(categoryDir);

      return (
        await Promise.all(slugs.map((slug) => readCatalogScript(source, category, slug, rootDir)))
      ).filter((script): script is PublicScriptCatalogItem => Boolean(script && isPubliclyVisible(script.submission)));
    }),
  );

  return categoryScripts.flat();
}

async function readCatalogScript(
  source: PublicCatalogSource,
  category: string,
  slug: string,
  rootDir: string,
): Promise<PublicScriptCatalogItem | null> {
  try {
    const folderPath = join(rootDir, "content", "scripts", source, category, slug);
    const metadataPath = join(folderPath, `${slug}.json`);
    const submission = scriptSubmissionSchema.parse(JSON.parse(await readFile(metadataPath, "utf8")));
    const scriptPath = await findScriptPath(folderPath, slug);
    const scriptBody = await readFile(scriptPath, "utf8");

    return {
      source,
      official: source === "operatoros",
      category,
      slug,
      scriptPath,
      metadataPath,
      scriptBody,
      execution_type: deriveExecutionType(submission),
      submission,
    };
  } catch {
    return null;
  }
}

async function findScriptPath(folderPath: string, slug: string): Promise<string> {
  const files = await readdir(folderPath);
  const scriptFile = files.find((file) => {
    const extension = extname(file).toLowerCase();

    return file.startsWith(slug) && SCRIPT_EXTENSIONS.includes(extension as (typeof SCRIPT_EXTENSIONS)[number]);
  });

  if (!scriptFile) {
    throw new Error(`No script file found for ${slug}.`);
  }

  return join(folderPath, scriptFile);
}

async function readDirectorySafe(path: string): Promise<string[]> {
  try {
    return await readdir(path);
  } catch {
    return [];
  }
}

function isPubliclyVisible(submission: ScriptSubmission): boolean {
  return submission.review_status === "approved" || submission.review_status === "published";
}

function matchesFilters(script: PublicScriptCatalogItem, filters: ScriptCatalogFilters): boolean {
  const search = filters.search?.trim().toLowerCase();

  if (search) {
    const haystack = [
      script.submission.title,
      script.submission.summary,
      script.submission.description,
      script.submission.author.name,
      script.category,
      script.submission.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(search)) {
      return false;
    }
  }

  if (filters.category && script.category !== filters.category) {
    return false;
  }

  if (filters.tag && !script.submission.tags.includes(filters.tag)) {
    return false;
  }

  if (filters.risk && script.submission.safety.risk_level !== filters.risk) {
    return false;
  }

  if (filters.executionType && script.execution_type !== filters.executionType) {
    return false;
  }

  if (filters.requiresAdmin !== undefined && script.submission.safety.requires_admin !== filters.requiresAdmin) {
    return false;
  }

  if (filters.source === "operatoros" && script.source !== "operatoros") {
    return false;
  }

  if (filters.source === "community" && script.source !== "community") {
    return false;
  }

  if (filters.source === "official" && !script.official) {
    return false;
  }

  return true;
}
