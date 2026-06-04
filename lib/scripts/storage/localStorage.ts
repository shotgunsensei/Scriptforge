import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  ScriptAuditEvent,
  ScriptStorage,
  ScriptStorageRecord,
  ScriptStorageWriteResult,
  ScriptVersionSnapshot,
} from "./types";
import type { ScriptSubmission } from "../schema";

export class LocalScriptStorage implements ScriptStorage {
  constructor(private readonly rootDir = process.cwd()) {}

  createPendingCommunity(record: ScriptStorageRecord) {
    return this.writeScriptRecord(record, join(this.rootDir, "content", "pending-community-scripts", record.submission.slug));
  }

  saveCommunityApproved(record: ScriptStorageRecord) {
    return this.writeScriptRecord(
      record,
      join(this.rootDir, "content", "scripts", "community", record.submission.category, record.submission.slug),
    );
  }

  saveOperatorOsDraft(record: ScriptStorageRecord) {
    return this.writeScriptRecord(
      record,
      join(this.rootDir, "content", "scripts", "operatoros", "_drafts", record.submission.category, record.submission.slug),
    );
  }

  saveOperatorOsApproved(record: ScriptStorageRecord) {
    return this.writeScriptRecord(
      record,
      join(this.rootDir, "content", "scripts", "operatoros", record.submission.category, record.submission.slug),
    );
  }

  async appendAuditEvent(event: ScriptAuditEvent): Promise<void> {
    const auditDir = join(this.rootDir, "content", "audit-events");
    await mkdir(auditDir, { recursive: true });
    await writeFile(join(auditDir, `${event.createdAt.replace(/[:.]/g, "-")}-${event.slug}-${event.type}.json`), `${JSON.stringify(event, null, 2)}\n`, "utf8");
  }

  async appendVersionSnapshot(snapshot: ScriptVersionSnapshot): Promise<void> {
    const versionDir = join(this.rootDir, "content", "script-versions", snapshot.sourceType, snapshot.slug);
    await mkdir(versionDir, { recursive: true });
    await writeFile(
      join(versionDir, `${snapshot.createdAt.replace(/[:.]/g, "-")}-${snapshot.version}.json`),
      `${JSON.stringify(snapshot, null, 2)}\n`,
      "utf8",
    );
  }

  private async writeScriptRecord(
    record: ScriptStorageRecord,
    folderPath: string,
  ): Promise<ScriptStorageWriteResult> {
    await mkdir(folderPath, { recursive: true });

    const scriptPath = join(folderPath, `${record.submission.slug}${record.scriptExtension}`);
    const metadataPath = join(folderPath, `${record.submission.slug}.json`);
    const readmePath = join(folderPath, "README.md");

    await writeFile(scriptPath, `${record.scriptBody.trim()}\n`, "utf8");
    await writeFile(metadataPath, `${JSON.stringify(record.submission, null, 2)}\n`, "utf8");
    await writeFile(readmePath, buildReadme(record.submission), "utf8");

    return {
      submission: record.submission,
      folderPath,
      files: {
        script: scriptPath,
        metadata: metadataPath,
        readme: readmePath,
      },
    };
  }
}

function buildReadme(submission: ScriptSubmission): string {
  const safetyFlags =
    submission.safety.risk_flags.length > 0 ? submission.safety.risk_flags.join(", ") : "none";

  return `# ${submission.title}

${submission.summary}

## Review

- Source type: ${submission.source_type}
- Review status: ${submission.review_status}
- Reviewed by: ${submission.reviewed_by ?? "not reviewed"}
- Reviewed at: ${submission.reviewed_at ?? "not reviewed"}
${submission.source_type === "community" && submission.review_status === "pending_review" ? "- Auto-approved: no\n" : ""}

## Use Case

${submission.use_case}

## Safety

- Risk level: ${submission.safety.risk_level}
- Scan status: ${submission.safety.scan_status}
- Risk flags: ${safetyFlags}
- Requires admin: ${submission.safety.requires_admin ? "yes" : "no"}

${submission.safety.notes ?? ""}

## Requirements

${submission.requirements.map((requirement) => `- ${requirement.name}`).join("\n") || "- None documented"}

## Examples

${submission.examples.map((example) => `### ${example.title}\n\n\`\`\`powershell\n${example.command}\n\`\`\``).join("\n\n") || "No examples documented."}

## License

${submission.license}${submission.attribution_required ? " - attribution required" : ""}
`;
}
