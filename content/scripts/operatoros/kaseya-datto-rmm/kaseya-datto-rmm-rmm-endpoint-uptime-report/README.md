# Kaseya / Datto RMM RMM Endpoint Uptime Report

Read-only Kaseya / Datto RMM script for rmm endpoint uptime report.

## Source

- Official OperatorOS script: yes
- Category: kaseya-datto-rmm
- Review status: approved
- Reviewed by: OperatorOS Seed Generator

## Use Case

Use this script when building a Kaseya / Datto RMM health report, onboarding baseline, recurring audit, or escalation packet.

## Safety

- Risk level: low
- Scan status: passed
- Requires admin: no
- Read-only audit/reporting: yes

Official OperatorOS read-only audit/reporting seed script. Review tenant scope and permissions before running.

## Requirements

- Windows PowerShell 5.1 or newer on an endpoint managed by Kaseya or Datto RMM.

## Example

```powershell
./kaseya-datto-rmm-rmm-endpoint-uptime-report.ps1
```

## Output

PowerShell object output suitable for pipeline export, transcript capture, or manual review.

## License

Proprietary OperatorOS ScriptForge Seed
