# Exchange Online Mailbox Permission Audit

Read-only Exchange Online script for mailbox permission audit.

## Source

- Official OperatorOS script: yes
- Category: exchange-online
- Review status: approved
- Reviewed by: OperatorOS Seed Generator

## Use Case

Use this script when building a Exchange Online health report, onboarding baseline, recurring audit, or escalation packet.

## Safety

- Risk level: low
- Scan status: passed
- Requires admin: yes
- Read-only audit/reporting: yes

Official OperatorOS read-only audit/reporting seed script. Review tenant scope and permissions before running.

## Requirements

- Exchange Online PowerShell module with read-only recipient and organization permissions.

## Example

```powershell
./exchange-online-mailbox-permission-audit.ps1
```

## Output

PowerShell object output suitable for pipeline export, transcript capture, or manual review.

## License

Proprietary OperatorOS ScriptForge Seed
