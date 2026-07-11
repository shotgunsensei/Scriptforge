# Allscripts PM File / COM / CLSID Validation

Validates Allscripts PM executable files, manually registers COM components if needed, and checks the failing CLSID.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-008
- Category: healthcare-app-remediation
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Healthcare App Remediation component for the documented workflow: Validates Allscripts PM executable files, manually registers COM components if needed, and checks the failing CLSID. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: high
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: yes
- Touches filesystem: no

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-008. Ready state: Ready. Sensitivity: Internal. Static scanner did not match high-risk command patterns. Use /RegServer only after files exist and install completed. Do not force copy/register until EDR is healthy and files exist. Workbook source note: File Library: CMC_Veradigm_PM_EDR_Remediation_Runbook.pdf. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell / CMD.
- Recommended run context: Elevated CMD/PowerShell after successful install.

## Parameters

- AllscriptsPath: Workbook input carried forward from: $AllscriptsPath, CLSID

## Example

```powershell
./healthcare-app-remediation-allscripts-pm-file-com-clsid-validation.ps1
```

## Workbook Notes

Use /RegServer only after files exist and install completed.

Do not force copy/register until EDR is healthy and files exist.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
