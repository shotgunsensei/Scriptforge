# SFC / DISM Repair Pass

Runs DISM restore health and SFC scan for component store / system file corruption.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-020
- Category: endpoint-remediation
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: General Internal
- Body type: CMD

## Use Case

Use this Endpoint Remediation component for the documented workflow: Runs DISM restore health and SFC scan for component store / system file corruption. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: medium
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: no

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-020. Ready state: Ready. Sensitivity: General Internal. Static scanner did not match high-risk command patterns. Run while user can leave device online; can take 15-60 minutes. Review before production use. Workbook source note: Prior Windows 11/profile/DISM conversation. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell / CMD.
- Recommended run context: Elevated CMD/PowerShell.

## Parameters

- None documented.

## Example

```powershell
./endpoint-remediation-sfc-dism-repair-pass.ps1
```

## Workbook Notes

Run while user can leave device online; can take 15-60 minutes.

Review before production use.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
