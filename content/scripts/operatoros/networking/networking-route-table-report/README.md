# Networking Route Table Report

Read-only Networking script for route table report.

## Source

- Official OperatorOS script: yes
- Category: networking
- Review status: approved
- Reviewed by: OperatorOS Seed Generator

## Use Case

Use this script when building a Networking health report, onboarding baseline, recurring audit, or escalation packet.

## Safety

- Risk level: low
- Scan status: passed
- Requires admin: no
- Read-only audit/reporting: yes

Official OperatorOS read-only audit/reporting seed script. Review tenant scope and permissions before running.

## Requirements

- Windows PowerShell 5.1 or newer with network cmdlets available.

## Example

```powershell
./networking-route-table-report.ps1
```

## Output

PowerShell object output suitable for pipeline export, transcript capture, or manual review.

## License

Proprietary OperatorOS ScriptForge Seed
