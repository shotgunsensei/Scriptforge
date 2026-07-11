import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { scriptSubmissionSchema } from "./schema";

const operatorOsRoot = join(process.cwd(), "content", "scripts", "operatoros");
const requiredSeedCategories = [
  "active-directory",
  "entra-id",
  "exchange-online",
  "kaseya-datto-rmm",
  "microsoft-365",
  "networking",
  "security",
  "windows-server",
  "workstation-repair",
];

describe("official OperatorOS seed scripts", () => {
  it("includes at least 100 official scripts across required categories", async () => {
    const categories = (await readdir(operatorOsRoot)).filter((category) => !category.startsWith("_"));
    const counts = await Promise.all(
      categories.map(async (category) => ({
        category,
        count: (await readdir(join(operatorOsRoot, category))).length,
      })),
    );
    const total = counts.reduce((sum, item) => sum + item.count, 0);

    expect(total).toBeGreaterThanOrEqual(100);
    expect(counts.map((item) => item.category)).toEqual(expect.arrayContaining(requiredSeedCategories));
    expect(
      counts.filter((item) => requiredSeedCategories.includes(item.category)).every((item) => item.count >= 10),
    ).toBe(true);
  });

  it("writes a script, metadata JSON, and README for every seed folder", async () => {
    const categories = (await readdir(operatorOsRoot)).filter((category) => !category.startsWith("_"));
    const folders = (
      await Promise.all(
        categories.map(async (category) => {
          const categoryDir = join(operatorOsRoot, category);
          const slugs = await readdir(categoryDir);

          return slugs.map((slug) => ({
            category,
            folder: join(categoryDir, slug),
            slug,
          }));
        }),
      )
    ).flat();

    await Promise.all(
      folders.map(async ({ category, folder, slug }) => {
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
      }),
    );

    expect(folders.length).toBeGreaterThanOrEqual(108);
  }, 15000);
});
