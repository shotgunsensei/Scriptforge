# HUNTAgent Service Refresh

Restarts Datto EDR agent service and verifies returned state.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-003
- Category: security-edr
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Security / EDR component for the documented workflow: Restarts Datto EDR agent service and verifies returned state. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: medium
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: no

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-003. Ready state: Ready. Sensitivity: Internal. Static scanner did not match high-risk command patterns. Use only after service exists. If missing, run RMM maintenance or fallback install first. Review before production use. Workbook source note: File Library: CMC_Veradigm_PM_EDR_Remediation_Runbook.pdf. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell.
- Recommended run context: Elevated PowerShell after HUNTAgent exists.

## Parameters

- SiteConfiguration: Workbook input carried forward from: Service name HUNTAgent

## Example

```powershell
./security-edr-huntagent-service-refresh.ps1
```

## Workbook Notes

Use only after service exists. If missing, run RMM maintenance or fallback install first.

Review before production use.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
