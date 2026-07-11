# Restart Print Spooler + Optional Queue Clear

Restarts Print Spooler and optionally clears stuck jobs.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-016
- Category: printing-peripheral
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: General Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Printing / Peripheral component for the documented workflow: Restarts Print Spooler and optionally clears stuck jobs. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: medium
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: yes

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-016. Ready state: Ready. Sensitivity: General Internal. Static scanner matched: Remove-Item. Use clear-queue option only when jobs can be safely discarded. Clearing queue deletes pending print jobs. Workbook source note: Xodus Automation Pack v1 prior context / printer issue threads. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell.
- Recommended run context: Elevated PowerShell/RMM.

## Parameters

- ClearQueue: Workbook input carried forward from: $ClearQueue

## Example

```powershell
./printing-peripheral-restart-print-spooler-optional-queue-clear.ps1
```

## Workbook Notes

Use clear-queue option only when jobs can be safely discarded.

Clearing queue deletes pending print jobs.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
