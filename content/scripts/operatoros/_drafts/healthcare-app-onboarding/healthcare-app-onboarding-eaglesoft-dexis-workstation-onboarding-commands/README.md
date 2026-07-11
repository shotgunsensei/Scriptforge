# Eaglesoft / Dexis Workstation Onboarding Commands

Creates expected local account, maps Eaglesoft and Dexis shares, and launches Eaglesoft silent installer path.

## Source

- Official OperatorOS script: trusted draft
- Workbook ref: SCR-011
- Category: healthcare-app-onboarding
- Review status: trusted_draft
- Reviewed by: Pending OperatorOS reviewer
- Ready state: Needs Site Validation
- Sensitivity: Internal / Credential Redacted
- Body type: PowerShell / Command Block

## Use Case

Use this Healthcare App Onboarding component for the documented workflow: Creates expected local account, maps Eaglesoft and Dexis shares, and launches Eaglesoft silent installer path. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: high
- Scan status: warnings
- Requires admin: yes
- Touches network: yes
- Touches registry: no
- Touches filesystem: no

Held as a trusted draft until an authorized reviewer validates site variables, redactions, and blast radius. Workbook ref SCR-011. Ready state: Needs Site Validation. Sensitivity: Internal / Credential Redacted. Static scanner matched: Start-Process, User creation. Server/path details should be rechecked before production use. Avoid cleartext password. Confirm Workstation OS SMB limits and licensing constraints. Workbook source note: Prior PDF/onboarding conversation. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Workgroup Endpoint.
- Required tooling: PowerShell / CMD.
- Recommended run context: Elevated local admin on new workstation.

## Parameters

- SiteConfiguration: Workbook input carried forward from: Server names/IPs, local admin credentials, installer path

## Example

```powershell
./healthcare-app-onboarding-eaglesoft-dexis-workstation-onboarding-commands.ps1
```

## Workbook Notes

Server/path details should be rechecked before production use.

Avoid cleartext password. Confirm Workstation OS SMB limits and licensing constraints.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
