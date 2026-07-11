# Restart Service Verified

Restarts or starts a named service and verifies it reaches Running state.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-018
- Category: endpoint-remediation
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: General Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Endpoint Remediation component for the documented workflow: Restarts or starts a named service and verifies it reaches Running state. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: medium
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: no

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-018. Ready state: Ready. Sensitivity: General Internal. Static scanner did not match high-risk command patterns. Useful for CagService, HUNTAgent, Spooler, app services, etc. Review before production use. Workbook source note: Xodus Automation Pack v1 prior context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell.
- Recommended run context: Elevated PowerShell/RMM.

## Parameters

- ServiceName: Workbook input carried forward from: $ServiceName

## Example

```powershell
./endpoint-remediation-restart-service-verified.ps1
```

## Workbook Notes

Useful for CagService, HUNTAgent, Spooler, app services, etc.

Review before production use.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
