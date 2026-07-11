# Veradigm / Allscripts PM Local Copy Prep

Copies PM Client MSI and site certificate from network share to local temp folder before install.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-005
- Category: healthcare-app-deployment
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Healthcare App Deployment component for the documented workflow: Copies PM Client MSI and site certificate from network share to local temp folder before install. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: medium
- Scan status: warnings
- Requires admin: yes
- Touches network: yes
- Touches registry: no
- Touches filesystem: yes

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-005. Ready state: Ready. Sensitivity: Internal. Static scanner did not match high-risk command patterns. Always copy local before install to avoid network path/custom action inconsistencies. Run only after Datto EDR is healthy/current on the endpoint. Workbook source note: File Library: CMC_Veradigm_PM_EDR_Remediation_Runbook.pdf. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell / SMB.
- Recommended run context: Elevated or technician PowerShell with share access.

## Parameters

- LocalPath: Workbook input carried forward from: $LocalPath, $InstallerSource, $CertSource
- InstallerSource: Workbook input carried forward from: $LocalPath, $InstallerSource, $CertSource
- CertSource: Workbook input carried forward from: $LocalPath, $InstallerSource, $CertSource

## Example

```powershell
./healthcare-app-deployment-veradigm-allscripts-pm-local-copy-prep.ps1
```

## Workbook Notes

Always copy local before install to avoid network path/custom action inconsistencies.

Run only after Datto EDR is healthy/current on the endpoint.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
