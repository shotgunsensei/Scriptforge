# BitLocker Status Reporting

Reports BitLocker protection state and encryption percentage for local volumes.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-025
- Category: security-endpoint
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: General Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Security / Endpoint component for the documented workflow: Reports BitLocker protection state and encryption percentage for local volumes. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: low
- Scan status: passed
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: no

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-025. Ready state: Ready. Sensitivity: General Internal. Static scanner did not match high-risk command patterns. Good compliance reporting component. Review before production use. Workbook source note: OperatorOS MSP Automation Pack prior context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell.
- Recommended run context: Elevated PowerShell/RMM preferred.

## Parameters

- None documented.

## Example

```powershell
./security-endpoint-bitlocker-status-reporting.ps1
```

## Workbook Notes

Good compliance reporting component.

Review before production use.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
