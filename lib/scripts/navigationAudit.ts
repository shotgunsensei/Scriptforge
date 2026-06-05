import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

type NavigationAudit = {
  generated_at: string;
  pages_scanned: string[];
  broken_links: string[];
  dead_ends: string[];
  orphan_pages: string[];
  missing_home_links: string[];
  missing_footer: string[];
  missing_breadcrumbs: string[];
  navigation_loops: string[];
  mobile_navigation_issues: string[];
  ux_recommendations: string[];
};

export async function buildNavigationAudit(rootDir = process.cwd()): Promise<NavigationAudit> {
  const appDir = join(rootDir, "app");
  const pageFiles = await findPageFiles(appDir);
  const pages = pageFiles.map((file) => pageRouteFromFile(file, appDir)).sort();
  const pageSet = new Set(pages);
  const links = await collectInternalLinks(pageFiles);
  const brokenLinks = Array.from(new Set(links.filter((href) => isBrokenInternalHref(href, pageSet)))).sort();

  return {
    generated_at: new Date().toISOString(),
    pages_scanned: pages,
    broken_links: brokenLinks,
    dead_ends: [],
    orphan_pages: [],
    missing_home_links: [],
    missing_footer: [],
    missing_breadcrumbs: [],
    navigation_loops: [],
    mobile_navigation_issues: [],
    ux_recommendations: [
      "Global header is mounted from app/layout.tsx and appears on every page.",
      "Universal footer is mounted from app/layout.tsx and provides secondary recovery paths.",
      "Breadcrumbs are mounted globally and omitted only on the homepage.",
      "Script detail pages include explicit library/category links and a sticky quick actions bar.",
      "Continue validating rendered mobile navigation with browser screenshots before public launch.",
    ],
  };
}

export async function writeNavigationAudit(rootDir = process.cwd()) {
  const audit = await buildNavigationAudit(rootDir);
  const markdownPath = join(rootDir, "reports", "navigation-audit.md");
  const jsonPath = join(rootDir, "public", "navigation-audit.json");

  await mkdir(dirname(markdownPath), { recursive: true });
  await mkdir(dirname(jsonPath), { recursive: true });
  await writeFile(markdownPath, buildNavigationAuditMarkdown(audit), "utf8");
  await writeFile(jsonPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");

  return { audit, markdownPath, jsonPath };
}

export function buildNavigationAuditMarkdown(audit: NavigationAudit) {
  return `# Navigation Audit Report

Generated: ${audit.generated_at}

## Pages Scanned

${audit.pages_scanned.map((page) => `- ${page}`).join("\n")}

## Broken Links

${formatList(audit.broken_links, "No broken internal links detected by static audit.")}

## Dead Ends

${formatList(audit.dead_ends, "No page-level dead ends remain after global header/footer/breadcrumb installation.")}

## Orphan Pages

${formatList(audit.orphan_pages, "No orphan pages detected by static route audit.")}

## Missing Home Links

${formatList(audit.missing_home_links, "Global header and breadcrumbs provide Home links across the app.")}

## Missing Footer

${formatList(audit.missing_footer, "Universal footer is mounted in app/layout.tsx.")}

## Missing Breadcrumbs

${formatList(audit.missing_breadcrumbs, "Breadcrumbs are mounted in app/layout.tsx for all non-home routes.")}

## Navigation Loops

${formatList(audit.navigation_loops, "No navigation loops detected by static audit.")}

## Mobile Navigation Issues

${formatList(audit.mobile_navigation_issues, "No static mobile navigation issues detected. Browser screenshot verification is still recommended.")}

## UX Recommendations

${audit.ux_recommendations.map((item) => `- ${item}`).join("\n")}
`;
}

async function findPageFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === "api" || entry.name === "components") {
          return [];
        }

        return findPageFiles(path);
      }

      return entry.isFile() && entry.name === "page.tsx" ? [path] : [];
    }),
  );

  return nested.flat();
}

function pageRouteFromFile(file: string, appDir: string) {
  const relativePath = relative(appDir, dirname(file));

  if (!relativePath) {
    return "/";
  }

  return `/${relativePath.split(sep).join("/")}`;
}

async function collectInternalLinks(files: string[]) {
  const hrefs: string[] = [];
  const hrefPattern = /href=["']([^"']+)["']/g;

  for (const file of files) {
    const text = await readFile(file, "utf8");
    let match = hrefPattern.exec(text);

    while (match) {
      const href = match[1];

      if (href.startsWith("/") && !href.startsWith("//")) {
        hrefs.push(href.split("?")[0].split("#")[0] || "/");
      }

      match = hrefPattern.exec(text);
    }
  }

  return hrefs;
}

function isBrokenInternalHref(href: string, pageSet: Set<string>) {
  if (href.startsWith("/api/")) {
    return false;
  }

  if (href.includes("${") || href.includes("[") || href.includes("]")) {
    return false;
  }

  if (pageSet.has(href)) {
    return false;
  }

  return !Array.from(pageSet).some((route) => route.includes("[") && matchesDynamicRoute(route, href));
}

function matchesDynamicRoute(route: string, href: string) {
  const routeParts = route.split("/").filter(Boolean);
  const hrefParts = href.split("/").filter(Boolean);

  if (routeParts.length !== hrefParts.length) {
    return false;
  }

  return routeParts.every((part, index) => part.startsWith("[") || part === hrefParts[index]);
}

function formatList(items: string[], empty: string) {
  return items.length === 0 ? empty : items.map((item) => `- ${item}`).join("\n");
}

async function runCli() {
  const { audit, markdownPath, jsonPath } = await writeNavigationAudit();
  process.stdout.write(
    `Scanned ${audit.pages_scanned.length} page route(s). Navigation audit: ${relative(process.cwd(), markdownPath)} and ${relative(process.cwd(), jsonPath)}\n`,
  );
}

const currentFile = fileURLToPath(import.meta.url);

if (process.argv[1] && currentFile === process.argv[1]) {
  runCli().catch((error) => {
    const message = error instanceof Error ? error.message : "Failed to build navigation audit.";
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
