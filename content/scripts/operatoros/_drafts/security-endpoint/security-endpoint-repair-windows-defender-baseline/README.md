# Repair Windows Defender Baseline

Collects Defender state and attempts service/startup remediation.

## Source

- Official OperatorOS script: trusted draft
- Workbook ref: SCR-022
- Category: security-endpoint
- Review status: trusted_draft
- Reviewed by: Pending OperatorOS reviewer
- Ready state: Needs Review
- Sensitivity: General Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Security / Endpoint component for the documented workflow: Collects Defender state and attempts service/startup remediation. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: high
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: no

Held as a trusted draft until an authorized reviewer validates site variables, redactions, and blast radius. Workbook ref SCR-022. Ready state: Needs Review. Sensitivity: General Internal. Static scanner did not match high-risk command patterns. Do not conflict with third-party AV/EDR policy. Confirm customer security stack permits Microsoft Defender enforcement. Workbook source note: Prior script manifest/context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell.
- Recommended run context: Elevated PowerShell/RMM.

## Parameters

- None documented.

## Example

```powershell
./security-endpoint-repair-windows-defender-baseline.ps1
```

## Workbook Notes

Do not conflict with third-party AV/EDR policy.

Confirm customer security stack permits Microsoft Defender enforcement.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
