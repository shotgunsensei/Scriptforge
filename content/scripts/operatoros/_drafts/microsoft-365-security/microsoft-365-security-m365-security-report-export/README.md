# M365 Security Report Export

Generates tenant security posture report for MFA, CA, forwarding, audit logging, admins, guest sprawl, and inactive accounts.

## Source

- Official OperatorOS script: trusted draft
- Workbook ref: SCR-030
- Category: microsoft-365-security
- Review status: trusted_draft
- Reviewed by: Pending OperatorOS reviewer
- Ready state: Backlog / Design
- Sensitivity: Internal
- Body type: Design Stub

## Use Case

Use this Microsoft 365 / Security component for the documented workflow: Generates tenant security posture report for MFA, CA, forwarding, audit logging, admins, guest sprawl, and inactive accounts. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: medium
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: no

Held as a trusted draft until an authorized reviewer validates site variables, redactions, and blast radius. Workbook ref SCR-030. Ready state: Backlog / Design. Sensitivity: Internal. Static scanner did not match high-risk command patterns. Good productized assessment deliverable. Review before production use. Workbook source note: Prior context: Export-M365SecurityReport.ps1. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for M365 Tenant.
- Required tooling: PowerShell.
- Recommended run context: M365 read-only/admin session.

## Parameters

- SiteConfiguration: Workbook input carried forward from: Tenant ID, report output path

## Example

```powershell
./microsoft-365-security-m365-security-report-export.ps1
```

## Workbook Notes

Good productized assessment deliverable.

Review before production use.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
