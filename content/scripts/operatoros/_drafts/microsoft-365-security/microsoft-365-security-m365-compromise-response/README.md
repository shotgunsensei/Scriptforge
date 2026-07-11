# M365 Compromise Response

Emergency account compromise response: revoke sessions, disable forwarding/rules, require password reset, review OAuth grants.

## Source

- Official OperatorOS script: trusted draft
- Workbook ref: SCR-029
- Category: microsoft-365-security
- Review status: trusted_draft
- Reviewed by: Pending OperatorOS reviewer
- Ready state: Backlog / Design
- Sensitivity: Restricted
- Body type: Design Stub

## Use Case

Use this Microsoft 365 / Security component for the documented workflow: Emergency account compromise response: revoke sessions, disable forwarding/rules, require password reset, review OAuth grants. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: critical
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: no

Held as a trusted draft until an authorized reviewer validates site variables, redactions, and blast radius. Workbook ref SCR-029. Ready state: Backlog / Design. Sensitivity: Restricted. Static scanner did not match high-risk command patterns. Must include safe dry-run mode and action logging before production. High blast radius. Build with WhatIf, logging, and explicit action flags. Workbook source note: Prior context: Invoke-M365CompromiseResponse.ps1. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for M365 Tenant.
- Required tooling: Exchange Online / Graph PowerShell.
- Recommended run context: M365 security admin / Exchange admin.

## Parameters

- UserPrincipalName: Workbook input carried forward from: UserPrincipalName, approved response actions

## Example

```powershell
./microsoft-365-security-m365-compromise-response.ps1
```

## Workbook Notes

Must include safe dry-run mode and action logging before production.

High blast radius. Build with WhatIf, logging, and explicit action flags.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
