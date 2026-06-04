# Microsoft 365 Domain Verification Audit

Read-only Microsoft 365 script for domain verification audit.

## Source

- Official OperatorOS script: yes
- Category: microsoft-365
- Review status: approved
- Reviewed by: OperatorOS Seed Generator

## Use Case

Use this script when building a Microsoft 365 health report, onboarding baseline, recurring audit, or escalation packet.

## Safety

- Risk level: low
- Scan status: passed
- Requires admin: yes
- Read-only audit/reporting: yes

Official OperatorOS read-only audit/reporting seed script. Review tenant scope and permissions before running.

## Requirements

- Microsoft Graph PowerShell SDK with read-only Graph permissions.

## Example

```powershell
./microsoft-365-domain-verification-audit.ps1
```

## Output

PowerShell object output suitable for pipeline export, transcript capture, or manual review.

## License

Proprietary OperatorOS ScriptForge Seed
