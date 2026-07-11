# Datto EDR Repair / Fallback Install Workflow

Defines the repair order: run Datto EDR Maintenance [WIN], verify HUNTAgent, then fallback reinstall only if maintenance fails.

## Source

- Official OperatorOS script: trusted draft
- Workbook ref: SCR-004
- Category: security-edr
- Review status: trusted_draft
- Reviewed by: Pending OperatorOS reviewer
- Ready state: Ready - Redacted
- Sensitivity: Restricted / Token Redacted
- Body type: PowerShell / Command Block

## Use Case

Use this Security / EDR component for the documented workflow: Defines the repair order: run Datto EDR Maintenance [WIN], verify HUNTAgent, then fallback reinstall only if maintenance fails. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: critical
- Scan status: warnings
- Requires admin: yes
- Touches network: yes
- Touches registry: no
- Touches filesystem: no

Held as a trusted draft until an authorized reviewer validates site variables, redactions, and blast radius. Workbook ref SCR-004. Ready state: Ready - Redacted. Sensitivity: Restricted / Token Redacted. Static scanner did not match high-risk command patterns. The original runbook contains an environment-specific token. This workbook keeps that token redacted. Do not expose tenant URL/token in shared docs. Reboot after repair and confirm portal Last Seen before app install. Redactions: EDR tenant URL and install token redacted. Workbook source note: File Library: CMC_Veradigm_PM_EDR_Remediation_Runbook.pdf. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: Datto RMM / PowerShell.
- Recommended run context: Datto RMM first; elevated PowerShell only if fallback is approved.

## Parameters

- SiteConfiguration: Workbook input carried forward from: EDR tenant URL, install token, endpoint policy

## Example

```powershell
./security-edr-datto-edr-repair-fallback-install-workflow.ps1
```

## Workbook Notes

The original runbook contains an environment-specific token. This workbook keeps that token redacted.

Do not expose tenant URL/token in shared docs. Reboot after repair and confirm portal Last Seen before app install.

Redactions: EDR tenant URL and install token redacted.

## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
