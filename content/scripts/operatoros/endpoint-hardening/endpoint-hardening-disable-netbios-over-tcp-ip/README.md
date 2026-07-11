# Disable NetBIOS over TCP/IP

Disables NetBIOS over TCP/IP on active NICs.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-014
- Category: endpoint-hardening
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: General Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Endpoint Hardening component for the documented workflow: Disables NetBIOS over TCP/IP on active NICs. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: medium
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: no

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-014. Ready state: Ready. Sensitivity: General Internal. Static scanner did not match high-risk command patterns. Test with legacy apps before broad deployment. Legacy name resolution may rely on NetBIOS. Confirm DNS/WINS implications first. Workbook source note: Prior RMM component context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell / WMI.
- Recommended run context: Elevated PowerShell/RMM.

## Parameters

- None documented.

## Example

```powershell
./endpoint-hardening-disable-netbios-over-tcp-ip.ps1
```

## Workbook Notes

Test with legacy apps before broad deployment.

Legacy name resolution may rely on NetBIOS. Confirm DNS/WINS implications first.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
