import { randomUUID } from "node:crypto";
import type { ScriptSubmission } from "../schema";
import { createSupabaseServiceClient } from "../supabase";
import type {
  ScriptAuditEvent,
  ScriptStorage,
  ScriptStorageRecord,
  ScriptStorageWriteResult,
  ScriptVersionSnapshot,
} from "./types";
import { SupabaseScriptFileStorage } from "./supabaseStorage";

export class DatabaseScriptStorage implements ScriptStorage {
  private readonly supabase = createSupabaseServiceClient();
  private readonly files = new SupabaseScriptFileStorage();

  async createPendingCommunity(record: ScriptStorageRecord): Promise<ScriptStorageWriteResult> {
    return this.writeScriptRecord(record, `pending-community-scripts/${record.submission.slug}`);
  }

  async saveCommunityApproved(record: ScriptStorageRecord): Promise<ScriptStorageWriteResult> {
    return this.writeScriptRecord(record, `scripts/community/${record.submission.category}/${record.submission.slug}`);
  }

  async saveOperatorOsDraft(record: ScriptStorageRecord): Promise<ScriptStorageWriteResult> {
    return this.writeScriptRecord(
      record,
      `scripts/operatoros/_drafts/${record.submission.category}/${record.submission.slug}`,
    );
  }

  async saveOperatorOsApproved(record: ScriptStorageRecord): Promise<ScriptStorageWriteResult> {
    return this.writeScriptRecord(record, `scripts/operatoros/${record.submission.category}/${record.submission.slug}`);
  }

  async appendAuditEvent(event: ScriptAuditEvent): Promise<void> {
    const { error } = await this.supabase.from("script_audit_events").insert({
      id: randomUUID(),
      submission_id: null,
      slug: event.slug,
      source_type: event.sourceType,
      review_status: event.reviewStatus,
      event_type: event.type,
      actor: event.actor ?? null,
      notes: event.notes ?? null,
      created_at: event.createdAt,
    });

    if (error) {
      throw new Error(`Failed to write script audit event: ${error.message}`);
    }
  }

  async appendVersionSnapshot(snapshot: ScriptVersionSnapshot): Promise<void> {
    const { error } = await this.supabase.from("script_versions").insert({
      id: randomUUID(),
      submission_id: null,
      slug: snapshot.slug,
      source_type: snapshot.sourceType,
      version: snapshot.version,
      metadata_json: snapshot.metadata,
      script_body: snapshot.scriptBody,
      created_by: snapshot.createdBy ?? null,
      created_at: snapshot.createdAt,
    });

    if (error) {
      throw new Error(`Failed to write script version snapshot: ${error.message}`);
    }
  }

  private async writeScriptRecord(record: ScriptStorageRecord, folderPath: string): Promise<ScriptStorageWriteResult> {
    const scriptPath = `${folderPath}/${record.submission.slug}${record.scriptExtension}`;
    const metadataPath = `${folderPath}/${record.submission.slug}.json`;
    const readmePath = `${folderPath}/README.md`;
    const [scriptUri, metadataUri, readmeUri] = await Promise.all([
      this.files.uploadText(scriptPath, `${record.scriptBody.trim()}\n`, "text/plain; charset=utf-8"),
      this.files.uploadText(metadataPath, `${JSON.stringify(record.submission, null, 2)}\n`, "application/json; charset=utf-8"),
      this.files.uploadText(readmePath, buildReadme(record.submission), "text/markdown; charset=utf-8"),
    ]);

    const { error } = await this.supabase.from("script_submissions").upsert(
      {
        id: randomUUID(),
        slug: record.submission.slug,
        category: record.submission.category,
        source_type: record.submission.source_type,
        review_status: record.submission.review_status,
        metadata_json: record.submission,
        script_body: record.scriptBody,
        safety_scan_json: record.submission.safety,
        submitter_json: record.submission.submitter,
        reviewer_identity: record.submission.reviewed_by,
        reviewer_notes: record.reviewerNotes ?? null,
        reviewed_at: record.submission.reviewed_at,
        script_storage_path: scriptPath,
        metadata_storage_path: metadataPath,
        readme_storage_path: readmePath,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "source_type,category,slug" },
    );

    if (error) {
      throw new Error(`Failed to write script submission row: ${error.message}`);
    }

    return {
      submission: record.submission,
      folderPath: `supabase://${folderPath}`,
      files: {
        script: scriptUri,
        metadata: metadataUri,
        readme: readmeUri,
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

## Safety

- Risk level: ${submission.safety.risk_level}
- Scan status: ${submission.safety.scan_status}
- Risk flags: ${safetyFlags}
- Requires admin: ${submission.safety.requires_admin ? "yes" : "no"}

${submission.safety.notes ?? ""}

## Use Case

${submission.use_case}

## License

${submission.license}${submission.attribution_required ? " - attribution required" : ""}
`;
}
