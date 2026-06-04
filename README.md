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
  credibility.ts                     Public credibility score derivation
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
npm run seed:admin
```

## Environment Variables

```text
ADMIN_SUBMISSION_PASSWORD=change-this-password
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=scriptforge
COMMUNITY_UPLOAD_MAX_KB=250
ENABLE_COMMUNITY_UPLOADS=true
SCRIPT_STORAGE_DRIVER=local
DATABASE_URL=
ENABLE_CAPTCHA=true
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
RATE_LIMIT_DRIVER=memory
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
OPERATOROS_AUTH_MODE=password
SCRIPTFORGE_ADMIN_EMAIL=john@shotgunninjas.com
SCRIPTFORGE_ADMIN_SEED_PASSWORD=
SCRIPTFORGE_ADMIN_NAME="John Williams"
SCRIPTFORGE_ADMIN_ROLE=scriptforge_admin
```

`ADMIN_SUBMISSION_PASSWORD` is an emergency local development fallback for admin APIs. It should not be the primary production login method.

`SCRIPTFORGE_ADMIN_EMAIL`, `SCRIPTFORGE_ADMIN_SEED_PASSWORD`, `SCRIPTFORGE_ADMIN_NAME`, and `SCRIPTFORGE_ADMIN_ROLE` seed the first real admin account. Never commit the seed password or paste it into source code.

`NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` connect the server-side Supabase adapters. The service role key must stay server-only.

`SUPABASE_STORAGE_BUCKET` stores uploaded scripts, generated README files, metadata JSON, and generated ZIP packs. The default bucket name is `scriptforge`.

`COMMUNITY_UPLOAD_MAX_KB` controls public upload size limits. The default is `250`.

`ENABLE_COMMUNITY_UPLOADS` enables or disables the public community upload form and API.

`SCRIPT_STORAGE_DRIVER` selects submission persistence. Use `local` for development and tests. Use `database` in production with Supabase configured.

`DATABASE_URL` is used by migration tooling and deployment documentation. Runtime database access uses Supabase service credentials.

`ENABLE_CAPTCHA` requires public submissions to include a valid captcha token when set to `true`.

`TURNSTILE_SITE_KEY` renders the Cloudflare Turnstile widget. `TURNSTILE_SECRET_KEY` validates tokens server-side.

`RATE_LIMIT_DRIVER` selects public submission and admin-login rate limiting. Use `memory` for development and single-instance testing. Use `upstash` in production.

`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are required when `RATE_LIMIT_DRIVER=upstash`.

`OPERATOROS_AUTH_MODE` defaults to `password`. The future value `sso` routes admin checks through the OperatorOS SSO adapter placeholder.

## Storage Drivers

Storage abstraction files:

- `lib/scripts/storage/types.ts`
- `lib/scripts/storage/localStorage.ts`
- `lib/scripts/storage/databaseStorage.ts`
- `lib/scripts/storage/supabaseStorage.ts`
- `lib/scripts/storage/index.ts`

The local driver writes the same folder structure used by the development workflow:

- Pending community submissions: `content/pending-community-scripts/{slug}/`
- Trusted OperatorOS drafts: `content/scripts/operatoros/_drafts/{category}/{slug}/`
- Approved OperatorOS scripts: `content/scripts/operatoros/{category}/{slug}/`
- Audit events: `content/audit-events/*.json`
- Version snapshots: `content/script-versions/{source_type}/{slug}/*.json`

The database driver uses Supabase:

- Supabase Postgres stores submissions, versions, reviews, audit events, and admin users.
- Supabase Storage stores uploaded `.ps1`/`.psm1` files, generated metadata JSON, generated `README.md`, and generated ZIP packs.
- The driver fails closed when `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing.

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
- `script_admin_users`

The schema stores metadata JSON, script body, safety scan JSON, submitter info, source type, review status, reviewer identity, approval/rejection notes, Supabase Storage paths, timestamps, version snapshots, review history, admin users, and audit events. Apply this migration to Supabase Postgres before enabling `SCRIPT_STORAGE_DRIVER=database`.

## Auth And RBAC

Admin protection now goes through an auth adapter:

- `lib/scripts/auth/types.ts`
- `lib/scripts/auth/passwordAuth.ts`
- `lib/scripts/auth/operatorOsAuth.ts`
- `lib/scripts/auth/index.ts`
- `lib/scripts/admin-users.ts`

Roles:

- `scriptforge_admin`
- `scriptforge_reviewer`
- `scriptforge_contributor`

`OPERATOROS_AUTH_MODE=password` uses the ScriptForge seeded admin account plus the local emergency password fallback. `OPERATOROS_AUTH_MODE=sso` is reserved for the OperatorOS SSO adapter and should be wired to signed OperatorOS claims before production use.

Admin account storage uses the active local storage model today:

```text
content/admin-users/{user_id}.json
```

Passwords are stored as bcrypt hashes, never as plain text.

## Admin Seed And Login

Seed the owner account after setting the seed password in `.env.local`:

```powershell
npm run seed:admin
```

Default seed identity:

- Email: `john@shotgunninjas.com`
- Name: `John Williams`
- Role: `scriptforge_admin`

The password must come from `SCRIPTFORGE_ADMIN_SEED_PASSWORD`. The seed script checks for the existing email, creates the account only when missing, writes an `admin_seeded` audit event, and never prints the password.

Login routes:

- `GET /admin/login`
- `POST /api/admin/login`
- `POST /api/admin/logout`

Admin pages under `/admin/scripts/*` require a valid admin session cookie. API routes also enforce roles:

- `scriptforge_admin`: full access.
- `scriptforge_reviewer`: review, approve, reject, needs-changes, and promote workflows.
- `scriptforge_contributor`: official draft/admin submission workflow.

Password rotation warning: seed passwords are bootstrap credentials. Rotate the seeded admin password after first successful login in production. Until a password-management UI exists, rotate by updating the stored hash through a controlled admin maintenance script or by reseeding a fresh environment.

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

- Requires `scriptforge_admin` or `scriptforge_contributor` session.
- Accepts `ADMIN_SUBMISSION_PASSWORD` only as an emergency local API fallback.
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
- Rate limiting uses `RATE_LIMIT_DRIVER`. The memory driver is for dev only; the Upstash REST driver is intended for production.
- Captcha uses `ENABLE_CAPTCHA`, `TURNSTILE_SITE_KEY`, and `TURNSTILE_SECRET_KEY`. When enabled, the public form renders the Turnstile widget and submits `captcha_token`.

Keep `ENABLE_CAPTCHA=true` for internet-facing deployments.

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

Review routes require `scriptforge_admin` or `scriptforge_reviewer`.

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
- `github_repo_url`
- `github_file_url`
- `github_commit_sha`
- `github_last_synced_at`
- `last_tested_at`
- `powershell_compatibility`
- `safety_score`
- `documentation_score`
- `community_rating`
- `download_count`
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

Script detail pages include a public credibility layer:

- Last reviewed
- Last tested
- PowerShell compatibility
- Safety score
- Documentation score
- Community rating placeholder
- Download count placeholder
- GitHub repository, file URL, commit SHA, and last sync timestamp when available

Official scripts also show a `Verified by OperatorOS` review panel explaining that the script is part of the official catalog and has been reviewed for metadata, safety scan results, compatibility, and technician documentation.

Every detail page includes issue links for:

- Report broken script
- Report unsafe script
- Request improvement

Issue links currently open an email draft to `scripts@operatoros.net`. Replace this with GitHub Issues or OperatorOS support intake when the public feedback workflow is ready.

Detail pages also render the submission changelog from `documentation.changelog`.

## Generated Script Packs

Generated pack downloads are exposed from:

```text
GET /api/scripts/packs/{pack}
```

Available packs:

- `m365-pack`
- `ad-pack`
- `exchange-pack`
- `workstation-repair-pack`
- `security-audit-pack`

The pack endpoint returns a generated ZIP assembled from approved official OperatorOS scripts in the mapped categories. These are convenience downloads, not signed release artifacts.

When `SCRIPT_STORAGE_DRIVER=database`, the pack endpoint returns a generated ZIP file and stores the ZIP under Supabase Storage at `packs/{pack}/{file}.zip`.

## Production Health

Health endpoint:

```text
GET /api/health
```

The response checks:

- app name and package version
- configured domain: `scripts.operatoros.net`
- active storage driver
- Supabase database connectivity when `SCRIPT_STORAGE_DRIVER=database`
- generated `public/script-index.json` presence and count

Admin pages also show a production warning when `NODE_ENV=production` and `SCRIPT_STORAGE_DRIVER=local`.

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
- `credibility`
- `github_repo_url`
- `github_file_url`
- `github_commit_sha`
- `github_last_synced_at`
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

Target production stack:

- Next.js on Vercel
- Supabase Postgres for metadata, submissions, reviews, audit events, and admin users
- Supabase Storage bucket `scriptforge` for uploads, generated README files, metadata files, and ZIP packs
- Upstash Redis for rate limiting
- Cloudflare Turnstile for public upload protection
- Domain: `scripts.operatoros.net`

Important production notes:

- Vercel serverless filesystem writes are not durable across deployments or instances.
- Keep `SCRIPT_STORAGE_DRIVER=local` only for development and tests.
- Set `SCRIPT_STORAGE_DRIVER=database` in Vercel production.
- Apply `db/migrations/001_scriptforge_persistence.sql` to Supabase Postgres before production traffic.
- Create the Supabase Storage bucket named by `SUPABASE_STORAGE_BUCKET`.
- Set `SCRIPTFORGE_ADMIN_EMAIL`, `SCRIPTFORGE_ADMIN_SEED_PASSWORD`, `SCRIPTFORGE_ADMIN_NAME`, and `SCRIPTFORGE_ADMIN_ROLE` in deployment secrets, run `npm run seed:admin`, then rotate the bootstrap password.
- Keep `ADMIN_SUBMISSION_PASSWORD` unset or restricted to local emergency use.
- Set `COMMUNITY_UPLOAD_MAX_KB`, `ENABLE_COMMUNITY_UPLOADS`, `ENABLE_CAPTCHA`, `TURNSTILE_SITE_KEY`, and `TURNSTILE_SECRET_KEY` in Vercel environment variables.
- Set `RATE_LIMIT_DRIVER=upstash`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN` for production.
- Use `OPERATOROS_AUTH_MODE=password` until OperatorOS SSO claims are available.
- Do not store secrets inside submitted scripts or metadata.
- Rebuild `public/script-index.json` during CI/build if the catalog is committed to the repository.

Recommended Vercel build command:

```powershell
npm run scripts:build-index && npm run build
```

Preview deployments:

- Use `SCRIPT_STORAGE_DRIVER=local` for UI-only previews, or point previews at an isolated Supabase project.
- Use separate Turnstile preview keys if public upload testing is required.
- Avoid using production `SUPABASE_SERVICE_ROLE_KEY` in untrusted preview contexts.

Production domain setup:

- Add `scripts.operatoros.net` to the Vercel project domains.
- Add the DNS record requested by Vercel at the OperatorOS DNS provider.
- Configure the same hostname in Cloudflare Turnstile allowed domains.
- Verify HTTPS is active before enabling community uploads.

Post-deploy verification checklist:

- `GET https://scripts.operatoros.net/api/health` returns `ok: true`.
- `/admin/login` accepts the seeded admin account.
- `/admin/scripts/submit` and `/admin/scripts/review` do not show the local-storage production warning.
- Public upload renders Turnstile and rejects missing/invalid tokens.
- Community upload stores metadata in Supabase Postgres and files in Supabase Storage.
- Admin review can approve/reject/mark-needs-changes.
- Approved scripts appear in `/scripts`.
- Generated pack URLs return ZIP downloads.
- `npm audit` remains clean in CI.
