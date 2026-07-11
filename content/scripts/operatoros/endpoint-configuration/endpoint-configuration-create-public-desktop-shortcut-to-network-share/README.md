# Create Public Desktop Shortcut to Network Share

Creates a .lnk shortcut on the Public Desktop pointing to a network share or application path.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-013
- Category: endpoint-configuration
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: General Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Endpoint Configuration component for the documented workflow: Creates a .lnk shortcut on the Public Desktop pointing to a network share or application path. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: low
- Scan status: passed
- Requires admin: yes
- Touches network: yes
- Touches registry: no
- Touches filesystem: no

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-013. Ready state: Ready. Sensitivity: General Internal. Static scanner did not match high-risk command patterns. Useful as a generic deployment component. Review before production use. Workbook source note: Prior RMM component context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell / WScript.Shell.
- Recommended run context: RMM LocalSystem/Admin.

## Parameters

- ShortcutName: Workbook input carried forward from: $ShortcutName, $TargetPath, $Description
- TargetPath: Workbook input carried forward from: $ShortcutName, $TargetPath, $Description
- Description: Workbook input carried forward from: $ShortcutName, $TargetPath, $Description

## Example

```powershell
./endpoint-configuration-create-public-desktop-shortcut-to-network-share.ps1
```

## Workbook Notes

Useful as a generic deployment component.

Review before production use.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
