# Entra ID Stale User Sign-In Audit

Read-only Entra ID script for stale user sign-in audit.

## Source

- Official OperatorOS script: yes
- Category: entra-id
- Review status: approved
- Reviewed by: OperatorOS Seed Generator

## Use Case

Use this script when building a Entra ID health report, onboarding baseline, recurring audit, or escalation packet.

## Safety

- Risk level: low
- Scan status: passed
- Requires admin: yes
- Read-only audit/reporting: yes

Official OperatorOS read-only audit/reporting seed script. Review tenant scope and permissions before running.

## Requirements

- Microsoft Graph PowerShell SDK with Directory.Read.All or equivalent read-only permissions.

## Example

```powershell
./entra-id-stale-user-sign-in-audit.ps1
```

## Output

PowerShell object output suitable for pipeline export, transcript capture, or manual review.

## License

Proprietary OperatorOS ScriptForge Seed
