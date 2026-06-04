# Windows Server Installed Role Audit

Read-only Windows Server script for installed role audit.

## Source

- Official OperatorOS script: yes
- Category: windows-server
- Review status: approved
- Reviewed by: OperatorOS Seed Generator

## Use Case

Use this script when building a Windows Server health report, onboarding baseline, recurring audit, or escalation packet.

## Safety

- Risk level: low
- Scan status: passed
- Requires admin: no
- Read-only audit/reporting: yes

Official OperatorOS read-only audit/reporting seed script. Review tenant scope and permissions before running.

## Requirements

- Windows PowerShell 5.1 or newer on Windows Server.

## Example

```powershell
./windows-server-installed-role-audit.ps1
```

## Output

PowerShell object output suitable for pipeline export, transcript capture, or manual review.

## License

Proprietary OperatorOS ScriptForge Seed
