# AGENTS.md - OperatorOS ScriptForge

## Project Identity

OperatorOS ScriptForge is a production-grade OperatorOS module for managing, reviewing, publishing, and running PowerShell scripts in a controlled ecosystem.

Treat this project as part of the OperatorOS platform, not as a standalone toy script gallery. Preserve OperatorOS security, entitlement, tenant, audit, and subscription assumptions wherever they exist.

## Required Stack

Use the project stack consistently:

- Next.js
- TypeScript
- Tailwind CSS
- Zod

Do not introduce another primary framework, validation library, styling system, or runtime architecture unless the repository already requires it or John explicitly approves it.

## Repository Workflow

Before changing code:

- Inspect the repository structure and existing conventions.
- Read `README.md`, package files, env examples, schema files, route files, and relevant config when present.
- Identify the package manager from lockfiles or package metadata.
- Preserve existing auth, billing, SSO, tenant, entitlement, and role-gate behavior.
- Keep changes surgical unless the existing architecture is clearly broken.

After meaningful changes:

- Update `README.md` for every major workflow that was added or changed.
- Run available lint, build, and test commands.
- Report commands run, results, files changed, and any remaining manual setup.

## Script Catalog Boundaries

Keep official OperatorOS scripts separate from community scripts.

Recommended separation:

- Official scripts: curated, reviewed, OperatorOS-maintained, eligible for trusted placement.
- Community scripts: user-submitted, untrusted by default, pending review until approved by an authorized reviewer.

Do not mix these sources in storage, routing, review state, or UI in a way that makes trust level ambiguous.

## Submission and Review Rules

Never auto-approve public submissions.

All public or community script submissions must:

- Start in a pending or equivalent review state.
- Be associated with submitter identity where auth exists.
- Preserve tenant/org ownership where multi-tenant data exists.
- Be safety-scanned before approval, publication, or execution.
- Require explicit approval by an authorized reviewer before becoming public or official.
- Produce safe audit logs for submission, scan, approval, rejection, and publication events.

Approval logic must be server-side. Do not trust client-side state for script status, reviewer role, tenant ownership, billing, or entitlement.

## PowerShell Safety Requirements

All submitted PowerShell must be safety-scanned.

Safety scanning should check for obviously dangerous or suspicious patterns, including but not limited to:

- Destructive filesystem operations.
- Credential harvesting or secret exfiltration.
- Download-and-execute behavior.
- Encoded commands.
- Obfuscation.
- Persistence mechanisms.
- Privilege escalation attempts.
- Unapproved remote network calls.
- Registry, service, firewall, scheduled-task, and policy changes.

Do not present safety scanning as a guarantee that a script is safe. Treat it as one required control in a larger review workflow.

Execution features must default to safe behavior:

- No automatic execution of community submissions.
- No silent elevation.
- No hardcoded credentials.
- No public exposure of secrets, private endpoints, customer data, tenant data, or internal MSP details.
- Prefer dry-run, preview, diff, sandbox, or explicit confirmation flows where applicable.

## Architecture Expectations

Use clear folder structure and typed schemas.

Preferred patterns:

- Typed TypeScript interfaces for shared domain concepts.
- Zod schemas for request validation, form validation, API payloads, and script metadata.
- Server-side validation for all write operations.
- Service-layer separation for scan, review, catalog, entitlement, audit, and execution logic.
- Idempotent seed and migration behavior where database setup exists.
- Explicit loading, empty, error, pending-review, rejected, approved, and published states in UI workflows.

Avoid:

- Mock-only features presented as production-complete.
- Client-only enforcement of approval, billing, entitlement, role, or tenant access.
- Mixing official and community script trust levels.
- Hardcoded secrets, API keys, tokens, private URLs, credentials, or customer data.
- Large dependency swaps without a clear production benefit.

## OperatorOS Integration Rules

When OperatorOS auth, SSO, billing, module entitlement, or seeded admin/demo behavior exists:

- Preserve it.
- Do not weaken lockout, RBAC, JWT/session, bcrypt/password, SSO consume, `/healthz`, Stripe, or entitlement logic.
- Treat OperatorOS as the parent entitlement and checkout authority.
- Keep premium ScriptForge features gated where applicable.
- Make checkout and entitlement failures safe when required environment variables are missing.

## UI/UX Direction

ScriptForge should feel like an OperatorOS security and automation console:

- Dark command-center interface.
- Clear separation between official, community, pending-review, rejected, and approved scripts.
- Fast scanning and review workflows.
- Strong status labels, risk indicators, and audit visibility.
- Mobile-responsive layouts.
- Useful empty states and error states.

Do not use generic SaaS styling when product-specific OperatorOS visuals are practical.

## Verification Standard

Run available verification commands after changes:

- Lint.
- Type-check.
- Build.
- Tests.

If any command is unavailable or fails, report the exact blocker and do not imply success.

