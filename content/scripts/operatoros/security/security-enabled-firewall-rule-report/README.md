# Security Enabled Firewall Rule Report

Read-only Security script for enabled firewall rule report.

## Source

- Official OperatorOS script: yes
- Category: security
- Review status: approved
- Reviewed by: OperatorOS Seed Generator

## Use Case

Use this script when building a Security health report, onboarding baseline, recurring audit, or escalation packet.

## Safety

- Risk level: low
- Scan status: passed
- Requires admin: no
- Read-only audit/reporting: yes

Official OperatorOS read-only audit/reporting seed script. Review tenant scope and permissions before running.

## Requirements

- Windows PowerShell 5.1 or newer with permission to read local security state.

## Example

```powershell
./security-enabled-firewall-rule-report.ps1
```

## Output

PowerShell object output suitable for pipeline export, transcript capture, or manual review.

## License

Proprietary OperatorOS ScriptForge Seed
