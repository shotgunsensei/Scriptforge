import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { buildModernizationRoadmap } from "../lib/scripts/modernization";

async function main() {
  const rootDir = process.cwd();
  const roadmap = await buildModernizationRoadmap(rootDir);
  let changed = 0;

  for (const script of roadmap.scripts) {
    const metadataPath = join(rootDir, "content", "scripts", "operatoros", script.category, script.slug, `${script.slug}.json`);
    const metadata = JSON.parse(await readFile(metadataPath, "utf8")) as Record<string, unknown>;
    const nextMetadata = {
      ...metadata,
      quality_score: script.productionReadinessScore,
      safety_score: script.safetyScore,
      maturity_score: script.operationalMaturityScore,
      certification_level: script.certificationLevel,
      last_reviewed: metadata.reviewed_at ?? null,
      last_tested: metadata.last_tested ?? metadata.last_tested_at ?? null,
      review_owner: metadata.reviewed_by ?? "OperatorOS ScriptForge",
    };

    if (JSON.stringify(metadata) !== JSON.stringify(nextMetadata)) {
      await writeFile(metadataPath, `${JSON.stringify(nextMetadata, null, 2)}\n`, "utf8");
      changed += 1;
    }
  }

  process.stdout.write(`Applied quality metadata to ${changed} official script metadata file(s).\n`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "Failed to apply quality metadata.";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
