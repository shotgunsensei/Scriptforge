# Firewall Profile Audit / Disable Command

Checks policy-driven firewall state and provides command to disable profiles when explicitly approved.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-034
- Category: endpoint-configuration
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Endpoint Configuration component for the documented workflow: Checks policy-driven firewall state and provides command to disable profiles when explicitly approved. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: high
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: yes
- Touches filesystem: no

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-034. Ready state: Ready. Sensitivity: Internal. Static scanner did not match high-risk command patterns. Use gpresult first. Domain GPO may re-enable firewall after reboot. Disabling firewall is high-risk and may violate policy. Workbook source note: Prior firewall re-enabling context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell / GPO.
- Recommended run context: Elevated PowerShell / Group Policy review.

## Parameters

- None documented.

## Example

```powershell
./endpoint-configuration-firewall-profile-audit-disable-command.ps1
```

## Workbook Notes

Use gpresult first. Domain GPO may re-enable firewall after reboot.

Disabling firewall is high-risk and may violate policy.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
