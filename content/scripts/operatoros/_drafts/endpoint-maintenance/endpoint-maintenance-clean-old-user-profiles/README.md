# Clean Old User Profiles

Finds and optionally removes non-special user profiles older than a threshold.

## Source

- Official OperatorOS script: trusted draft
- Workbook ref: SCR-021
- Category: endpoint-maintenance
- Review status: trusted_draft
- Reviewed by: Pending OperatorOS reviewer
- Ready state: Needs Review
- Sensitivity: General Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Endpoint Maintenance component for the documented workflow: Finds and optionally removes non-special user profiles older than a threshold. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: high
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: no

Held as a trusted draft until an authorized reviewer validates site variables, redactions, and blast radius. Workbook ref SCR-021. Ready state: Needs Review. Sensitivity: General Internal. Static scanner did not match high-risk command patterns. Never remove active, VIP, roaming, or app-bound profiles without validation. Defaults to report-only. Deletion line is commented. Workbook source note: Prior script manifest/context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell / CIM.
- Recommended run context: Elevated PowerShell/RMM.

## Parameters

- DaysOld: Workbook input carried forward from: $DaysOld, $WhatIf
- WhatIf: Workbook input carried forward from: $DaysOld, $WhatIf

## Example

```powershell
./endpoint-maintenance-clean-old-user-profiles.ps1
```

## Workbook Notes

Never remove active, VIP, roaming, or app-bound profiles without validation.

Defaults to report-only. Deletion line is commented.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
