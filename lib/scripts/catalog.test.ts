import { mkdir, writeFile, rm } from "node:fs/promises";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildScriptPack, deriveExecutionType, getPublicScript, listPublicScripts } from "./catalog";
import type { ScriptSubmission } from "./schema";

const baseSubmission: ScriptSubmission = {
  title: "Collect Inventory",
  slug: "collect-inventory",
  version: "1.0.0",
  category: "endpoint",
  tags: ["inventory", "windows"],
  author: {
    name: "OperatorOS",
  },
  summary: "Collects endpoint inventory.",
  description: "Collects endpoint inventory.",
  use_case: "Use during endpoint triage.",
  safety: {
    risk_level: "low",
    scan_required: true,
    scan_status: "passed",
    risk_flags: [],
    requires_admin: false,
    touches_network: false,
    touches_registry: false,
    touches_filesystem: false,
  },
  requirements: [],
  parameters: [],
  examples: [],
  output: {
    format: "json",
  },
  script_body: "Get-ComputerInfo",
  documentation: {
    references: [],
  },
  monetization: {
    tier: "free",
    entitlement_required: false,
  },
  source_type: "operatoros",
  review_status: "approved",
  reviewed_by: "OperatorOS Admin",
  reviewed_at: "2026-06-04T12:00:00.000Z",
  submitter: {
    name: "OperatorOS Admin",
    email: "admin@operatoros.net",
  },
  license: "MIT",
  attribution_required: false,
};

describe("public script catalog", () => {
  it("lists approved OperatorOS and community scripts", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-catalog-"));

    try {
      await writeCatalogScript(rootDir, "operatoros", baseSubmission);
      await writeCatalogScript(rootDir, "community", {
        ...baseSubmission,
        slug: "restart-spooler",
        title: "Restart Spooler",
        source_type: "community",
        reviewed_by: "OperatorOS Admin",
        reviewed_at: "2026-06-04T12:00:00.000Z",
      });

      const scripts = await listPublicScripts({}, rootDir);

      expect(scripts).toHaveLength(2);
      expect(scripts.map((script) => script.source)).toEqual(expect.arrayContaining(["operatoros", "community"]));
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("filters by search, tag, risk, execution type, admin, and source", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-catalog-"));

    try {
      await writeCatalogScript(rootDir, "operatoros", {
        ...baseSubmission,
        safety: {
          ...baseSubmission.safety,
          risk_level: "medium",
          requires_admin: true,
        },
      });

      const filtered = await listPublicScripts(
        {
          search: "inventory",
          tag: "windows",
          risk: "medium",
          executionType: "admin",
          requiresAdmin: true,
          source: "official",
        },
        rootDir,
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].slug).toBe("collect-inventory");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("loads one public script by source category and slug", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-catalog-"));

    try {
      await writeCatalogScript(rootDir, "operatoros", baseSubmission);
      const script = await getPublicScript("operatoros", "endpoint", "collect-inventory", rootDir);

      expect(script?.submission.title).toBe("Collect Inventory");
      expect(script?.scriptBody).toContain("Get-ComputerInfo");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("derives execution type from safety metadata", () => {
    expect(deriveExecutionType(baseSubmission)).toBe("local");
    expect(
      deriveExecutionType({
        ...baseSubmission,
        safety: { ...baseSubmission.safety, requires_admin: true },
      }),
    ).toBe("admin");
    expect(
      deriveExecutionType({
        ...baseSubmission,
        safety: { ...baseSubmission.safety, risk_flags: ["destructive_filesystem"], touches_filesystem: true },
      }),
    ).toBe("destructive");
  });

  it("generates official script packs by category", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-catalog-"));

    try {
      await writeCatalogScript(rootDir, "operatoros", {
        ...baseSubmission,
        category: "active-directory",
        slug: "active-directory-user-inventory",
      });

      const pack = await buildScriptPack("ad-pack", rootDir);

      expect(pack?.pack.fileName).toBe("operatoros-ad-pack.ps1");
      expect(pack?.scripts).toHaveLength(1);
      expect(pack?.body).toContain("Collect Inventory");
      expect(pack?.body).toContain("Get-ComputerInfo");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });
  it("keeps protected metadata public while stripping both body fields from detail and list results", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-protected-"));
    try {
      await writeCatalogScript(rootDir,"operatoros",{...baseSubmission,script_body:"PRIVATE_BODY_SENTINEL",monetization:{tier:"operator",entitlement_required:true}});
      const detail = await getPublicScript("operatoros","endpoint","collect-inventory",rootDir);
      const list = await listPublicScripts({},rootDir);
      expect(detail?.submission.title).toBe("Collect Inventory");
      expect(detail?.scriptBody).toBe(""); expect(detail?.submission.script_body).toBe("");
      expect(JSON.stringify(list)).not.toContain("PRIVATE_BODY_SENTINEL");
      expect(list).toHaveLength(1);
    } finally { await rm(rootDir,{recursive:true,force:true}); }
  });
  it("does not build a protected pack body without an entitlement authority", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-protected-pack-"));
    try {
      await writeCatalogScript(rootDir,"operatoros",{...baseSubmission,category:"active-directory",script_body:"PRIVATE_PACK_SENTINEL",monetization:{tier:"operator",entitlement_required:true}});
      const pack = await buildScriptPack("ad-pack",rootDir);
      expect(pack?.requiresEntitlement).toBe(true); expect(pack?.body).toBeNull();
      expect(JSON.stringify(pack)).not.toContain("PRIVATE_PACK_SENTINEL");
    } finally { await rm(rootDir,{recursive:true,force:true}); }
  });
  it.each([{tier:"free" as const,entitlement_required:true},{tier:"operator" as const,entitlement_required:false}])("requires explicit free/public flags rather than one conflicting metadata flag", async monetization => {
    const rootDir = await mkdtemp(join(tmpdir(), "scriptforge-protected-flags-"));
    try {
      await writeCatalogScript(rootDir,"operatoros",{...baseSubmission,monetization});
      expect((await getPublicScript("operatoros","endpoint","collect-inventory",rootDir))?.scriptBody).toBe("");
    } finally { await rm(rootDir,{recursive:true,force:true}); }
  });

});

async function writeCatalogScript(
  rootDir: string,
  source: "operatoros" | "community",
  submission: ScriptSubmission,
) {
  const folder = join(rootDir, "content", "scripts", source, submission.category, submission.slug);
  await mkdir(folder, { recursive: true });
  await writeFile(join(folder, `${submission.slug}.json`), JSON.stringify(submission, null, 2), "utf8");
  await writeFile(join(folder, `${submission.slug}.ps1`), submission.script_body, "utf8");
}
