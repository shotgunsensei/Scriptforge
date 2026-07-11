# Datto EDR / HUNTAgent State Validation

Checks Datto/Kaseya/EDR services, agent processes, and installed software to confirm HUNTAgent state before Veradigm/Allscripts PM install.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-002
- Category: security-edr
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Security / EDR component for the documented workflow: Checks Datto/Kaseya/EDR services, agent processes, and installed software to confirm HUNTAgent state before Veradigm/Allscripts PM install. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: medium
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: yes
- Touches filesystem: no

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-002. Ready state: Ready. Sensitivity: Internal. Static scanner did not match high-risk command patterns. Run this before retrying PM installer. Do not proceed while Last Seen is stale. Use for validation only. Do not paste previous console output back into PowerShell. Workbook source note: File Library: CMC_Veradigm_PM_EDR_Remediation_Runbook.pdf. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell.
- Recommended run context: Elevated PowerShell on affected endpoint.

## Parameters

- None documented.

## Example

```powershell
./security-edr-datto-edr-huntagent-state-validation.ps1
```

## Workbook Notes

Run this before retrying PM installer. Do not proceed while Last Seen is stale.

Use for validation only. Do not paste previous console output back into PowerShell.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
