import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { scriptSubmissionSchema } from "./schema";

const operatorOsRoot = join(process.cwd(), "content", "scripts", "operatoros");

describe("official OperatorOS seed scripts", () => {
  it("includes at least 100 official scripts across required categories", async () => {
    const categories = await readdir(operatorOsRoot);
    const counts = await Promise.all(
      categories.map(async (category) => ({
        category,
        count: (await readdir(join(operatorOsRoot, category))).length,
      })),
    );
    const total = counts.reduce((sum, item) => sum + item.count, 0);

    expect(total).toBeGreaterThanOrEqual(100);
    expect(counts.map((item) => item.category).sort()).toEqual([
      "active-directory",
      "entra-id",
      "exchange-online",
      "kaseya-datto-rmm",
      "microsoft-365",
      "networking",
      "security",
      "windows-server",
      "workstation-repair",
    ]);
    expect(counts.every((item) => item.count >= 10)).toBe(true);
  });

  it("writes a script, metadata JSON, and README for every seed folder", async () => {
    const categories = await readdir(operatorOsRoot);
    let inspected = 0;

    for (const category of categories) {
      const categoryDir = join(operatorOsRoot, category);
      const slugs = await readdir(categoryDir);

      for (const slug of slugs) {
        const folder = join(categoryDir, slug);
        const ps1Path = join(folder, `${slug}.ps1`);
        const jsonPath = join(folder, `${slug}.json`);
        const readmePath = join(folder, "README.md");

        expect(existsSync(ps1Path)).toBe(true);
        expect(existsSync(jsonPath)).toBe(true);
        expect(existsSync(readmePath)).toBe(true);

        const metadata = scriptSubmissionSchema.parse(JSON.parse(await readFile(jsonPath, "utf8")));
        expect(metadata.source_type).toBe("operatoros");
        expect(metadata.review_status).toBe("approved");
        expect(metadata.category).toBe(category);
        expect(metadata.slug).toBe(slug);
        inspected += 1;
      }
    }

    expect(inspected).toBe(108);
  });
});
