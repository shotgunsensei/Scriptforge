# Active Directory Forest FSMO Audit

Read-only Active Directory script for forest fsmo audit.

## Source

- Official OperatorOS script: yes
- Category: active-directory
- Review status: approved
- Reviewed by: OperatorOS Seed Generator

## Use Case

Use this script when building a Active Directory health report, onboarding baseline, recurring audit, or escalation packet.

## Safety

- Risk level: low
- Scan status: passed
- Requires admin: yes
- Read-only audit/reporting: yes

Official OperatorOS read-only audit/reporting seed script. Review tenant scope and permissions before running.

## Requirements

- ActiveDirectory PowerShell module with domain read access.

## Example

```powershell
./active-directory-forest-fsmo-audit.ps1
```

## Output

PowerShell object output suitable for pipeline export, transcript capture, or manual review.

## License

Proprietary OperatorOS ScriptForge Seed
