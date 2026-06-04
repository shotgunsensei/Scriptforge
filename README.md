# OperatorOS ScriptForge

OperatorOS ScriptForge is the script submission, review, safety scanning, indexing, and public catalog layer for OperatorOS PowerShell automation.

The product keeps official OperatorOS scripts separate from community submissions. Official scripts are curated and can be promoted into the OperatorOS catalog. Community scripts are accepted into a pending queue, safety-scanned, reviewed by an admin, and only then approved into the public community catalog or promoted into the official OperatorOS catalog.

## Project Purpose

ScriptForge gives OperatorOS a controlled script marketplace and technician automation library:

- Official OperatorOS PowerShell script catalog.
- Public community submission intake.
- Admin-only review, edit, approval, rejection, and promotion workflow.
- Static PowerShell safety scanning.
- Public browsing pages with search and filtering.
- Generated JSON search index for approved scripts.
- Seed catalog of read-only audit/reporting scripts for MSP, Microsoft 365, Windows, security, networking, and RMM workflows.

## Folder Structure

```text
app/
  components/brand/                  Reusable ScriptForge visual system components
  admin/scripts/submit/              Admin official script submission UI
  admin/scripts/review/              Admin community review UI
  api/admin/scripts/                 Admin API routes for submit/review/approve/reject/promote
  api/community/scripts/submit/      Public community submission API
  community/submit/                  Public community submission UI
  scripts/                           Public script catalog and detail pages

content/
  pending-community-scripts/{slug}/  Unapproved public submissions
  scripts/operatoros/{category}/{slug}/
  scripts/community/{category}/{slug}/

lib/scripts/
  schema.ts                          Zod submission schema
  slug.ts                            Slug helpers
  safetyScanner.ts                   Static PowerShell scanner
  safety-scan.ts                     Schema-compatible scanner adapter
  audit.ts                           Audit event and version snapshot helpers
  admin-submit.ts                    Admin save workflow
  community-submit.ts                Public submission workflow
  review.ts                          Admin review and move workflow
  catalog.ts                         Public catalog reader
  indexer.ts                         Public search index builder
  auth/                              Password auth adapter plus OperatorOS SSO placeholder
  rateLimit/                         Memory rate limiter plus Upstash placeholder
  storage/                           Local storage driver plus database placeholder

db/
  migrations/001_scriptforge_persistence.sql

public/
  branding/                          Logo and favicon SVGs
  icons/                             Category SVG icons
  badges/                            Official/community/risk badge SVGs
  illustrations/                     Hero, search, submit, empty, success SVGs
  script-index.json                  Generated searchable index

scripts/
  seed-official-scripts.ts           Official seed catalog generator

templates/
  scriptforge-submission-template.json
  scriptforge-submission-template.yaml
```

Each approved script folder contains:

- `{slug}.ps1` or `{slug}.psm1`
- `{slug}.json`
- `README.md`

## Local Setup

Install dependencies:

```powershell
npm install
```

Create local environment values:

```powershell
Copy-Item .env.example .env.local
```

Set a non-default admin password in `.env.local` before using admin workflows.

Run the development server:

```powershell
npm run dev
```

Useful commands:

```powershell
npm run lint
npm test
npm run build
npm audit
npm run scripts:seed-official
npm run scripts:build-index
```

## Environment Variables

```text
ADMIN_SUBMISSION_PASSWORD=change-this-password
COMMUNITY_UPLOAD_MAX_KB=250
ENABLE_COMMUNITY_UPLOADS=true
SCRIPT_STORAGE_DRIVER=local
DATABASE_URL=
ENABLE_CAPTCHA=false
TURNSTILE_SECRET_KEY=
RATE_LIMIT_DRIVER=memory
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
OPERATOROS_AUTH_MODE=password
```

`ADMIN_SUBMISSION_PASSWORD` protects `/admin/scripts/*` workflows and admin APIs. The example value `change-this-password` is treated as not configured and must be replaced in real environments.

`COMMUNITY_UPLOAD_MAX_KB` controls public upload size limits. The default is `250`.

`ENABLE_COMMUNITY_UPLOADS` enables or disables the public community upload form and API.

`SCRIPT_STORAGE_DRIVER` selects submission persistence. Use `local` for development and tests. Use `database` only after the database adapter is implemented against the migration schema.

`DATABASE_URL` is required when `SCRIPT_STORAGE_DRIVER=database`.

`ENABLE_CAPTCHA` requires public submissions to include a valid captcha token when set to `true`.

`TURNSTILE_SECRET_KEY` is the Cloudflare Turnstile server-side secret used when captcha is enabled.

`RATE_LIMIT_DRIVER` selects public submission rate limiting. Use `memory` for development and single-instance testing. `upstash` is the production placeholder.

`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are required when `RATE_LIMIT_DRIVER=upstash`.

`OPERATOROS_AUTH_MODE` defaults to `password`. The future value `sso` routes admin checks through the OperatorOS SSO adapter placeholder.

## Storage Drivers

Storage abstraction files:

- `lib/scripts/storage/types.ts`
- `lib/scripts/storage/localStorage.ts`
- `lib/scripts/storage/databaseStorage.ts`
- `lib/scripts/storage/index.ts`

The local driver writes the same folder structure used by the development workflow:

- Pending community submissions: `content/pending-community-scripts/{slug}/`
- Trusted OperatorOS drafts: `content/scripts/operatoros/_drafts/{category}/{slug}/`
- Approved OperatorOS scripts: `content/scripts/operatoros/{category}/{slug}/`
- Audit events: `content/audit-events/*.json`
- Version snapshots: `content/script-versions/{source_type}/{slug}/*.json`

The database driver is intentionally fail-closed until a query implementation is wired. It requires `DATABASE_URL` and throws a clear placeholder error so production cannot silently fall back to nondurable local writes.

## Database Migration

Migration:

```text
db/migrations/001_scriptforge_persistence.sql
```

Tables:

- `script_submissions`
- `script_versions`
- `script_reviews`
- `script_audit_events`

The schema stores metadata JSON, script body, safety scan JSON, submitter info, source type, review status, reviewer identity, approval/rejection notes, timestamps, version snapshots, and audit events. Apply this migration to the production Postgres-compatible database before implementing and enabling `SCRIPT_STORAGE_DRIVER=database`.

## Auth And RBAC

Admin protection now goes through an auth adapter:

- `lib/scripts/auth/types.ts`
- `lib/scripts/auth/passwordAuth.ts`
- `lib/scripts/auth/operatorOsAuth.ts`
- `lib/scripts/auth/index.ts`

Roles:

- `scriptforge_admin`
- `scriptforge_reviewer`
- `scriptforge_contributor`

`OPERATOROS_AUTH_MODE=password` keeps the current password/session behavior for local development. `OPERATOROS_AUTH_MODE=sso` is reserved for the OperatorOS SSO adapter and should be wired to signed OperatorOS claims before production use.

## Admin Submission Workflow

Routes:

- `GET /admin/scripts/submit`
- `POST /api/admin/scripts/submit`

Admin submissions support:

- Paste PowerShell script body.
- Upload `.ps1`.
- Submit metadata.
- Save as `trusted_draft` or `approved`.

Server behavior:

- Requires admin password or admin session cookie.
- Forces `source_type: operatoros`.
- Runs static PowerShell safety scanning.
- Blocks approved saves when the scan fails.
- Writes trusted drafts to `content/scripts/operatoros/_drafts/{category}/{slug}/`.
- Writes approved scripts to `content/scripts/operatoros/{category}/{slug}/`.

## Public Community Submission Workflow

Routes:

- `GET /community/submit`
- `GET /api/community/scripts/submit?template=json`
- `GET /api/community/scripts/submit?template=yaml`
- `POST /api/community/scripts/submit`

Public users can:

- Download blank JSON template.
- Download blank YAML template.
- Fill out the web form.
- Paste script body.
- Upload `.ps1` or `.psm1`.
- Optionally upload filled `.json`, `.yaml`, or `.yml` metadata.

Public submission rules:

- Forced `source_type: community`.
- Forced `review_status: pending_review`.
- Forced `reviewed_by: null`.
- Forced `reviewed_at: null`.
- Never auto-approved.
- Saved under `content/pending-community-scripts/{slug}/`.

Public upload controls:

- Upload size limit defaults to `250 KB`.
- Allowed extensions: `.ps1`, `.psm1`, `.json`, `.yaml`, `.yml`.
- Rate limiting uses `RATE_LIMIT_DRIVER`. The memory driver is for dev only; the Upstash driver is a production placeholder.
- Captcha uses `ENABLE_CAPTCHA` and `TURNSTILE_SECRET_KEY`. When enabled, public submissions must include `captcha_token`.

Wire the Turnstile client widget and complete the Upstash adapter before enabling public uploads on an internet-facing deployment.

## Review Workflow

Routes:

- `GET /admin/scripts/review`
- `GET /api/admin/scripts/review`
- `PATCH /api/admin/scripts/review`

Admins can:

- View pending community scripts.
- See metadata.
- See script body.
- See safety scan results.
- Edit metadata.
- Edit script body.
- Save edits and refresh the safety scan.

Review edits keep scripts in `content/pending-community-scripts/{slug}/` until an approval, rejection, needs-changes, or promotion action is taken.

If a pending submission matches an already approved slug/category, the review API returns the current approved version with script-body and metadata change indicators. The admin UI shows this comparison before approval.

## Approval Workflow

Routes:

- `POST /api/admin/scripts/approve`
- `POST /api/admin/scripts/reject`
- `POST /api/admin/scripts/needs-changes`
- `POST /api/admin/scripts/promote`

Approval actions:

- Approve community script: moves to `content/scripts/community/{category}/{slug}/`.
- Promote community script to official OperatorOS: moves to `content/scripts/operatoros/{category}/{slug}/`.
- Reject: remains in `content/pending-community-scripts/{slug}/` with `review_status: rejected`.
- Needs changes: remains in `content/pending-community-scripts/{slug}/` with `review_status: needs_changes`.

Approval and promotion automatically rebuild `public/script-index.json`.

Lifecycle actions write audit events:

- `submission_created`
- `safety_scan_completed`
- `script_approved`
- `script_rejected`
- `script_marked_needs_changes`
- `script_promoted_to_official`
- `script_updated`

Approved scripts and admin edits create version snapshots through the storage adapter.

## Safety Scanner Behavior

Canonical scanner:

```text
lib/scripts/safetyScanner.ts
```

Schema-compatible adapter:

```text
lib/scripts/safety-scan.ts
```

The scanner returns:

- `risk_score`
- `matched_patterns`
- `warnings`
- `recommended_review_level`

It flags patterns including:

- `Remove-Item`
- `Invoke-Expression`
- `iex`
- `Start-Process`
- `Set-ExecutionPolicy`
- `Invoke-WebRequest`
- `curl`
- `wget`
- `New-Object Net.WebClient`
- `EncodedCommand`
- registry edits
- scheduled task creation
- service creation
- firewall changes
- user creation
- role assignment changes
- permission changes
- Graph permission grant changes
- OAuth app consent changes

The scanner is static analysis only. It is a required review control, not a guarantee that a script is safe.

## Script Template Format

Templates:

- `templates/scriptforge-submission-template.json`
- `templates/scriptforge-submission-template.yaml`

Schema:

- `lib/scripts/schema.ts`

Required top-level submission fields include:

- `title`
- `slug`
- `version`
- `category`
- `subcategory`
- `tags`
- `author`
- `summary`
- `description`
- `use_case`
- `safety`
- `requirements`
- `parameters`
- `examples`
- `output`
- `script_body`
- `documentation`
- `monetization`
- `source_type`
- `review_status`
- `reviewed_by`
- `reviewed_at`
- `submitter`
- `license`
- `attribution_required`

Source rules:

- Official/admin submissions use `source_type: operatoros`.
- Public submissions use `source_type: community`.
- Community submissions must start as `pending_review`.
- Community approvals require reviewer identity and timestamp.

## Public Script Browsing

Routes:

- `GET /scripts`
- `GET /scripts/operatoros`
- `GET /scripts/community`
- `GET /scripts/category/{category}`
- `GET /scripts/{source}/{category}/{slug}`

Public catalog filters:

- Search.
- Category.
- Tag.
- Risk level.
- Execution type.
- Requires admin.
- Official vs community source.

Official OperatorOS scripts show Official OperatorOS and Verified badges with premium styling. Community scripts show Community Submitted, Reviewed, and risk badges.

The ScriptForge visual system uses the OperatorOS palette:

- Background: `#0B1020`
- Card: `#121A2E`
- Border: `#24304A`
- Primary: `#E53935`
- Secondary: `#5E81F4`
- Accent: `#00C896`
- Text: `#F8FAFC`
- Muted: `#94A3B8`

Reusable brand components live in `app/components/brand/`, including `Logo`, `Hero`, `CategoryCard`, `BrandScriptCard`, `RiskBadge`, `OfficialBadge`, `CommunityBadge`, and `SearchBar`.

Community detail pages include this disclaimer:

```text
Community submitted scripts are reviewed for structure and obvious safety issues, but they are not official OperatorOS scripts. Review before running.
```

## Search Index Generation

Command:

```powershell
npm run scripts:build-index
```

Output:

```text
public/script-index.json
```

The indexer scans:

```text
content/scripts/operatoros
content/scripts/community
```

Each index entry contains:

- `title`
- `summary`
- `description`
- `category`
- `tags`
- `source_type`
- `risk_level`
- `execution_type`
- `requires_admin`
- `script_body_excerpt`
- `slug`
- `path`

The index is rebuilt automatically after admin approval and promotion workflows.

## Official Seed Scripts

Generate the official seed catalog:

```powershell
npm run scripts:seed-official
npm run scripts:build-index
```

The generator creates 108 read-only audit/reporting scripts across:

- Microsoft 365
- Exchange Online
- Entra ID
- Active Directory
- Windows Server
- Workstation Repair
- Security
- Networking
- Kaseya / Datto RMM

## Deployment Notes for Vercel

This app builds on Vercel as a Next.js application. Public browsing of committed `content/scripts/**` works well, but production submission/review workflows must use durable storage.

Important production notes:

- Vercel serverless filesystem writes are not durable across deployments or instances.
- Public browsing of committed `content/scripts/**` works well on Vercel.
- Keep `SCRIPT_STORAGE_DRIVER=local` only for development and tests.
- Do not set `SCRIPT_STORAGE_DRIVER=database` until `DatabaseScriptStorage` is implemented against `db/migrations/001_scriptforge_persistence.sql`.
- Recommended production storage path: Postgres metadata and review state, object/blob storage for script files if needed, and CI/build-time index generation from durable records.
- Set `ADMIN_SUBMISSION_PASSWORD` in Vercel environment variables.
- Set `COMMUNITY_UPLOAD_MAX_KB` and `ENABLE_COMMUNITY_UPLOADS` in Vercel environment variables.
- Keep `ENABLE_COMMUNITY_UPLOADS=false` until database storage, captcha UI, production rate limiting, abuse monitoring, and OperatorOS RBAC are wired.
- Use `OPERATOROS_AUTH_MODE=password` until OperatorOS SSO claims are available.
- Do not store secrets inside submitted scripts or metadata.
- Rebuild `public/script-index.json` during CI/build if the catalog is committed to the repository.

Suggested Vercel build command:

```powershell
npm run scripts:build-index && npm run build
```

Use the default Next.js output unless deployment requirements change.
