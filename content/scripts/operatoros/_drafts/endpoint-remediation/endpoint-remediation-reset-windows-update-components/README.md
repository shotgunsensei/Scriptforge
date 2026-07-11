# Reset Windows Update Components

Stops update services, clears update cache, restarts services, and kicks scan.

## Source

- Official OperatorOS script: trusted draft
- Workbook ref: SCR-019
- Category: endpoint-remediation
- Review status: trusted_draft
- Reviewed by: Pending OperatorOS reviewer
- Ready state: Needs Review
- Sensitivity: General Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Endpoint Remediation component for the documented workflow: Stops update services, clears update cache, restarts services, and kicks scan. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: high
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: yes

Held as a trusted draft until an authorized reviewer validates site variables, redactions, and blast radius. Workbook ref SCR-019. Ready state: Needs Review. Sensitivity: General Internal. Static scanner did not match high-risk command patterns. Use during Windows Update failures. Avoid on servers during production hours. May remove update cache and require time for rebuild. Workbook source note: Xodus Automation Pack v1 prior context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell / CMD.
- Recommended run context: Elevated PowerShell/RMM.

## Parameters

- None documented.

## Example

```powershell
./endpoint-remediation-reset-windows-update-components.ps1
```

## Workbook Notes

Use during Windows Update failures. Avoid on servers during production hours.

May remove update cache and require time for rebuild.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
