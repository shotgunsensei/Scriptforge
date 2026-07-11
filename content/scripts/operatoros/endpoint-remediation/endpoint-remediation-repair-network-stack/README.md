# Repair Network Stack

Flushes DNS, resets Winsock and TCP/IP stack, then registers DNS.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-015
- Category: endpoint-remediation
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: General Internal
- Body type: CMD

## Use Case

Use this Endpoint Remediation component for the documented workflow: Flushes DNS, resets Winsock and TCP/IP stack, then registers DNS. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: medium
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: no

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-015. Ready state: Ready. Sensitivity: General Internal. Static scanner did not match high-risk command patterns. Requires reboot to fully apply winsock/IP reset. Warn user before reboot. Workbook source note: Xodus Automation Pack v1 prior context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: CMD / PowerShell.
- Recommended run context: Elevated CMD/PowerShell; reboot recommended.

## Parameters

- None documented.

## Example

```powershell
./endpoint-remediation-repair-network-stack.ps1
```

## Workbook Notes

Requires reboot to fully apply winsock/IP reset.

Warn user before reboot.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
