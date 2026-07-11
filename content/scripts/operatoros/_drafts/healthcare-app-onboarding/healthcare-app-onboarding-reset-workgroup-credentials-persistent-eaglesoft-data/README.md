# Reset Workgroup Credentials + Persistent Eaglesoft DATA Drive

Clears stale stored credentials and maps Eaglesoft DATA share persistently to Z:.

## Source

- Official OperatorOS script: trusted draft
- Workbook ref: SCR-010
- Category: healthcare-app-onboarding
- Review status: trusted_draft
- Reviewed by: Pending OperatorOS reviewer
- Ready state: Ready - Redacted
- Sensitivity: Internal / Credential Redacted
- Body type: PowerShell / Command Block

## Use Case

Use this Healthcare App Onboarding component for the documented workflow: Clears stale stored credentials and maps Eaglesoft DATA share persistently to Z:. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: high
- Scan status: warnings
- Requires admin: yes
- Touches network: yes
- Touches registry: no
- Touches filesystem: no

Held as a trusted draft until an authorized reviewer validates site variables, redactions, and blast radius. Workbook ref SCR-010. Ready state: Ready - Redacted. Sensitivity: Internal / Credential Redacted. Static scanner did not match high-risk command patterns. Hardcoded password was intentionally removed. Use Datto secure variables or runtime prompt. Do not store cleartext credentials in scripts. Use RMM secure variables or credential vault. Redactions: Password redacted. Workbook source note: Gmail/personal context: Reset Workgroup Credentials + Persistent Eaglesoft DATA Drive. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Workgroup Endpoint.
- Required tooling: PowerShell / cmdkey / net use.
- Recommended run context: Elevated or user-context PowerShell depending mapping need.

## Parameters

- Server: Workbook input carried forward from: $Server, $Share, $DriveLetter, $LocalUser, $Password
- Share: Workbook input carried forward from: $Server, $Share, $DriveLetter, $LocalUser, $Password
- DriveLetter: Workbook input carried forward from: $Server, $Share, $DriveLetter, $LocalUser, $Password
- LocalUser: Workbook input carried forward from: $Server, $Share, $DriveLetter, $LocalUser, $Password
- Password: Password must be supplied through an approved secure variable, vault, or runtime prompt. Sensitive.

## Example

```powershell
./healthcare-app-onboarding-reset-workgroup-credentials-persistent-eaglesoft-data.ps1
```

## Workbook Notes

Hardcoded password was intentionally removed. Use Datto secure variables or runtime prompt.

Do not store cleartext credentials in scripts. Use RMM secure variables or credential vault.

Redactions: Password redacted.

## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
