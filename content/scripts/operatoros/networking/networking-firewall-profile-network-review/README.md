# Networking Firewall Profile Network Review

Read-only Networking script for firewall profile network review.

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
./networking-firewall-profile-network-review.ps1
```

## Output

PowerShell object output suitable for pipeline export, transcript capture, or manual review.

## License

Proprietary OperatorOS ScriptForge Seed
