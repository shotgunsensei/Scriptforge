import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import YAML from "yaml";
import { describe, expect, it } from "vitest";
import jsonTemplate from "../../templates/scriptforge-submission-template.json";
import { createScriptSlug, isValidScriptSlug } from "./slug";
import { scriptSubmissionSchema } from "./schema";

const templatePath = resolve("templates", "scriptforge-submission-template.yaml");

describe("script submission schema", () => {
  it("validates the JSON submission template", () => {
    expect(scriptSubmissionSchema.safeParse(jsonTemplate).success).toBe(true);
  });

  it("validates the YAML submission template", () => {
    const yamlTemplate = YAML.parse(readFileSync(templatePath, "utf8"));

    expect(scriptSubmissionSchema.safeParse(yamlTemplate).success).toBe(true);
  });

  it("rejects community submissions that skip pending review", () => {
    const result = scriptSubmissionSchema.safeParse({
      ...jsonTemplate,
      source_type: "community",
      review_status: "approved",
      safety: {
        ...jsonTemplate.safety,
        scan_required: true,
      },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path.join(".") === "review_status")).toBe(true);
  });

  it("requires safety scanning for every submission", () => {
    const result = scriptSubmissionSchema.safeParse({
      ...jsonTemplate,
      safety: {
        ...jsonTemplate.safety,
        scan_required: false,
      },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path.join(".") === "safety.scan_required")).toBe(true);
  });

  it("normalizes and validates script slugs", () => {
    expect(createScriptSlug("Collect Windows System Inventory!")).toBe("collect-windows-system-inventory");
    expect(isValidScriptSlug("collect-windows-system-inventory")).toBe(true);
    expect(isValidScriptSlug("Admin")).toBe(false);
    expect(isValidScriptSlug("admin")).toBe(false);
  });
});
