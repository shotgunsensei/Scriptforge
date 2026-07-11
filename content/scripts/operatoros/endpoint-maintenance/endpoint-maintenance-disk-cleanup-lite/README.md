# Disk Cleanup Lite

Cleans common temp/download caches and reports recovered space.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-017
- Category: endpoint-maintenance
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: General Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Endpoint Maintenance component for the documented workflow: Cleans common temp/download caches and reports recovered space. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: medium
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: yes

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-017. Ready state: Ready. Sensitivity: General Internal. Static scanner matched: Remove-Item. Avoid deleting logs/evidence during active investigation. Review before production use. Workbook source note: Xodus Automation Pack v1 prior context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell.
- Recommended run context: Elevated PowerShell/RMM.

## Parameters

- IncludeUserTemp: Workbook input carried forward from: $IncludeUserTemp, optional paths

## Example

```powershell
./endpoint-maintenance-disk-cleanup-lite.ps1
```

## Workbook Notes

Avoid deleting logs/evidence during active investigation.

Review before production use.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
