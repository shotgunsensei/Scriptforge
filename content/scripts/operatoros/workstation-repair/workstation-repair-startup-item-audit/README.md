# Workstation Repair Startup Item Audit

Read-only Workstation Repair script for startup item audit.

## Source

- Official OperatorOS script: yes
- Category: workstation-repair
- Review status: approved
- Reviewed by: OperatorOS Seed Generator

## Use Case

Use this script when building a Workstation Repair health report, onboarding baseline, recurring audit, or escalation packet.

## Safety

- Risk level: low
- Scan status: passed
- Requires admin: no
- Read-only audit/reporting: yes

Official OperatorOS read-only audit/reporting seed script. Review tenant scope and permissions before running.

## Requirements

- Windows PowerShell 5.1 or newer on a Windows workstation.

## Example

```powershell
./workstation-repair-startup-item-audit.ps1
```

## Output

PowerShell object output suitable for pipeline export, transcript capture, or manual review.

## License

Proprietary OperatorOS ScriptForge Seed
