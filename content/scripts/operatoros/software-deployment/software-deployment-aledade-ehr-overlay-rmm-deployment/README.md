# Aledade EHR Overlay RMM Deployment

Deploys Aledade Assist/EHR Overlay machine-wide, logs install results, validates registry/config, and enforces Chrome extension policy.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-001
- Category: software-deployment
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready - Redacted
- Sensitivity: Internal / Redacted
- Body type: PowerShell / Command Block

## Use Case

Use this Software Deployment component for the documented workflow: Deploys Aledade Assist/EHR Overlay machine-wide, logs install results, validates registry/config, and enforces Chrome extension policy. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: high
- Scan status: warnings
- Requires admin: yes
- Touches network: yes
- Touches registry: yes
- Touches filesystem: yes

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-001. Ready state: Ready - Redacted. Sensitivity: Internal / Redacted. Static scanner matched: Start-Process, Invoke-WebRequest, Registry edits. Full source exists in File Library. Workbook contains a redacted/portable skeleton so client-specific license values are not exposed. Keep license/download values out of shared copies. Use LocalSystem and confirm Chrome/extension policy after install. Redactions: Download URL and license key intentionally redacted. Workbook source note: File Library: Aledade_EHR_Overlay_Datto_RMM_Component.ps1. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: Datto RMM / PowerShell / MSI.
- Recommended run context: Datto RMM LocalSystem, 64-bit PowerShell, 30 minute timeout.

## Parameters

- DownloadUrl: Workbook input carried forward from: $DownloadUrl, $LicenseKey, $PracticeId, $ExpectedSha256, $InstallScope
- LicenseKey: LicenseKey must be supplied through an approved secure variable, vault, or runtime prompt. Sensitive.
- PracticeId: Workbook input carried forward from: $DownloadUrl, $LicenseKey, $PracticeId, $ExpectedSha256, $InstallScope
- ExpectedSha256: Workbook input carried forward from: $DownloadUrl, $LicenseKey, $PracticeId, $ExpectedSha256, $InstallScope
- InstallScope: Workbook input carried forward from: $DownloadUrl, $LicenseKey, $PracticeId, $ExpectedSha256, $InstallScope

## Example

```powershell
./software-deployment-aledade-ehr-overlay-rmm-deployment.ps1
```

## Workbook Notes

Full source exists in File Library. Workbook contains a redacted/portable skeleton so client-specific license values are not exposed.

Keep license/download values out of shared copies. Use LocalSystem and confirm Chrome/extension policy after install.

Redactions: Download URL and license key intentionally redacted.

## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
