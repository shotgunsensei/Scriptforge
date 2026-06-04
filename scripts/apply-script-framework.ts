import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FRAMEWORK_BOOTSTRAP = `$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\\..\\..\\framework\\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}
`;

async function main() {
  const rootDir = process.cwd();
  const operatorOsDir = join(rootDir, "content", "scripts", "operatoros");
  const metadataPaths = await findFiles(operatorOsDir, ".json");
  let changed = 0;

  for (const metadataPath of metadataPaths) {
    const metadata = JSON.parse(await readFile(metadataPath, "utf8")) as {
      slug?: string;
      source_type?: string;
      script_body?: string;
      documentation?: { changelog?: string };
    };

    if (metadata.source_type !== "operatoros" || !metadata.slug) {
      continue;
    }

    const folder = dirname(metadataPath);
    const files = await readdir(folder);
    const scriptFile = files.find((file) => file.startsWith(metadata.slug ?? "") && extname(file).toLowerCase() === ".ps1");

    if (!scriptFile) {
      continue;
    }

    const scriptPath = join(folder, scriptFile);
    const currentBody = await readFile(scriptPath, "utf8");
    const updatedBody = addFrameworkBootstrap(currentBody);
    const changelogEntry = "1.1.0 - Added OperatorOS enterprise framework import bootstrap.";
    const existingChangelog = metadata.documentation?.changelog ?? "";
    const changelogLines = existingChangelog
      .split(/\r?\n/)
      .filter((line, index, lines) => line !== changelogEntry || lines.indexOf(line) === index);
    const nextChangelog = changelogLines.includes(changelogEntry)
      ? changelogLines.join("\n")
      : [...changelogLines, changelogEntry].filter(Boolean).join("\n");
    const metadataChanged = metadata.script_body !== updatedBody || existingChangelog !== nextChangelog;

    if (updatedBody === currentBody && !metadataChanged) {
      continue;
    }

    metadata.script_body = updatedBody;
    metadata.documentation = {
      ...metadata.documentation,
      changelog: nextChangelog,
    };

    if (updatedBody !== currentBody) {
      await writeFile(scriptPath, updatedBody, "utf8");
    }
    await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
    changed += 1;
  }

  process.stdout.write(`Updated OperatorOS framework bootstrap on ${changed} official script(s).\n`);
}

export function addFrameworkBootstrap(scriptBody: string) {
  const normalized = removeExistingFrameworkBootstrap(scriptBody.replace(/\r\n/g, "\n")).trimEnd();
  const lines = normalized.split("\n");
  const insertAt = findBootstrapInsertIndex(lines);

  return [...lines.slice(0, insertAt), "", FRAMEWORK_BOOTSTRAP.trimEnd(), "", ...lines.slice(insertAt)].join("\n").trimEnd() + "\n";
}

function removeExistingFrameworkBootstrap(scriptBody: string) {
  return scriptBody.replace(
    /\n*\$OperatorOSFrameworkPath\s*=\s*Join-Path\s+-Path\s+\$PSScriptRoot\s+-ChildPath\s+['"][^'"]*OperatorOS-ScriptFramework\.psm1['"]\s*\nif\s*\(Test-Path\s+-LiteralPath\s+\$OperatorOSFrameworkPath\)\s*\{\s*\n\s*Import-Module\s+\$OperatorOSFrameworkPath\s+-Force\s*\n\}\s*\n*/gi,
    "\n",
  );
}

function findBootstrapInsertIndex(lines: string[]) {
  let index = 0;

  while (index < lines.length && lines[index].trim().startsWith("#")) {
    index += 1;
  }

  while (index < lines.length && lines[index].trim() === "") {
    index += 1;
  }

  if (/^param\s*\(/i.test(lines[index]?.trim() ?? "")) {
    return findParamBlockEnd(lines, index);
  }

  return index;
}

function findParamBlockEnd(lines: string[], startIndex: number) {
  let depth = 0;

  for (let index = startIndex; index < lines.length; index++) {
    for (const character of lines[index]) {
      if (character === "(") {
        depth += 1;
      }

      if (character === ")") {
        depth -= 1;
      }
    }

    if (depth <= 0 && index > startIndex) {
      return index + 1;
    }
  }

  return startIndex + 1;
}

async function findFiles(root: string, extension: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(root, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === "_framework" || entry.name === "framework") {
          return [];
        }

        return findFiles(path, extension);
      }

      return entry.isFile() && extname(entry.name).toLowerCase() === extension ? [path] : [];
    }),
  );

  return nested.flat();
}

const currentFile = fileURLToPath(import.meta.url);

if (process.argv[1] && currentFile === process.argv[1]) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : "Failed to apply OperatorOS framework bootstrap.";
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
