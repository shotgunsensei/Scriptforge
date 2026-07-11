# Unexpected Shutdown / Display Layout Evidence Collector

Collects recent shutdown, power, display, and application events for workstations powering off unexpectedly.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-036
- Category: diagnostics-evidence
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: General Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Diagnostics / Evidence component for the documented workflow: Collects recent shutdown, power, display, and application events for workstations powering off unexpectedly. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: low
- Scan status: passed
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: yes

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-036. Ready state: Ready. Sensitivity: General Internal. Static scanner did not match high-risk command patterns. Good evidence collector before guessing hardware/software cause. Review before production use. Workbook source note: Prior VSS/shutdown diagnostic context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell.
- Recommended run context: Elevated PowerShell/RMM.

## Parameters

- DaysBack: Workbook input carried forward from: $DaysBack

## Example

```powershell
./diagnostics-evidence-unexpected-shutdown-display-layout-evidence-collector.ps1
```

## Workbook Notes

Good evidence collector before guessing hardware/software cause.

Review before production use.



## Output

Exports technician evidence or findings to CSV while also returning PowerShell output.

## License

Proprietary OperatorOS ScriptForge Import
