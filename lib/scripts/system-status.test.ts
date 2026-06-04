import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import packageJson from "../../package.json";
import { getScriptForgeSystemStatus } from "./system-status";

const originalStorageDriver = process.env.SCRIPT_STORAGE_DRIVER;

afterEach(() => {
  if (originalStorageDriver === undefined) {
    delete process.env.SCRIPT_STORAGE_DRIVER;
    return;
  }

  process.env.SCRIPT_STORAGE_DRIVER = originalStorageDriver;
});

describe("ScriptForge system status", () => {
  it("reports local command center metrics from the public index", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-system-"));

    try {
      process.env.SCRIPT_STORAGE_DRIVER = "local";
      await mkdir(join(rootDir, "public"), { recursive: true });
      await writeFile(
        join(rootDir, "public", "script-index.json"),
        JSON.stringify({
          generated_at: "2026-06-04T16:00:00.000Z",
          count: 108,
          scripts: [],
        }),
        "utf8",
      );

      const status = await getScriptForgeSystemStatus(rootDir);

      expect(status.scriptsIndexed).toBe(108);
      expect(status.pendingReviews).toBe(0);
      expect(status.communityUploads).toBe(0);
      expect(status.storageDriver).toBe("local");
      expect(status.buildVersion).toBe(packageJson.version);
      expect(status.healthStatus).toBe("healthy");
      expect(status.lastIndexRebuild).toBe("2026-06-04T16:00:00.000Z");
      expect(status.databaseOk).toBeNull();
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("marks the system degraded when the script index is missing", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-system-"));

    try {
      process.env.SCRIPT_STORAGE_DRIVER = "local";

      const status = await getScriptForgeSystemStatus(rootDir);

      expect(status.scriptsIndexed).toBe(0);
      expect(status.indexOk).toBe(false);
      expect(status.healthStatus).toBe("degraded");
      expect(status.healthMessage).toContain("script-index.json");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });
});
