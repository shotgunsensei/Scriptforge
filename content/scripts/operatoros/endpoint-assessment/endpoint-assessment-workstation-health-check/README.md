# Workstation Health Check

Collects quick health snapshot: OS, uptime, disk, RAM, key services, pending reboot indicators.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-023
- Category: endpoint-assessment
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: General Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Endpoint Assessment component for the documented workflow: Collects quick health snapshot: OS, uptime, disk, RAM, key services, pending reboot indicators. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: low
- Scan status: warnings
- Requires admin: no
- Touches network: no
- Touches registry: yes
- Touches filesystem: no

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-023. Ready state: Ready. Sensitivity: General Internal. Static scanner did not match high-risk command patterns. Good candidate for ScriptForge/lead magnet. Review before production use. Workbook source note: OperatorOS MSP Automation Pack prior context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell.
- Recommended run context: PowerShell/RMM.

## Parameters

- None documented.

## Example

```powershell
./endpoint-assessment-workstation-health-check.ps1
```

## Workbook Notes

Good candidate for ScriptForge/lead magnet.

Review before production use.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
