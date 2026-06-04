# Entra ID Recent Sign-In Report

Read-only Entra ID script for recent sign-in report.

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
./entra-id-recent-sign-in-report.ps1
```

## Output

PowerShell object output suitable for pipeline export, transcript capture, or manual review.

## License

Proprietary OperatorOS ScriptForge Seed
