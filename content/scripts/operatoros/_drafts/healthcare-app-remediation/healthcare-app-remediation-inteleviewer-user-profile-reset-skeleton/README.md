# InteleViewer User Profile Reset Skeleton

Targets user-level application corruption when app works in a new admin profile but fails in existing user profile.

## Source

- Official OperatorOS script: trusted draft
- Workbook ref: SCR-035
- Category: healthcare-app-remediation
- Review status: trusted_draft
- Reviewed by: Pending OperatorOS reviewer
- Ready state: Needs Validation
- Sensitivity: Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Healthcare App Remediation component for the documented workflow: Targets user-level application corruption when app works in a new admin profile but fails in existing user profile. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: high
- Scan status: warnings
- Requires admin: no
- Touches network: no
- Touches registry: no
- Touches filesystem: yes

Held as a trusted draft until an authorized reviewer validates site variables, redactions, and blast radius. Workbook ref SCR-035. Ready state: Needs Validation. Sensitivity: Internal. Static scanner did not match high-risk command patterns. Exact cache/config paths should be validated per installed version. Backup before reset. Validate application-specific config paths. Workbook source note: Prior InteleViewer troubleshooting context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell.
- Recommended run context: Technician session with affected user signed out.

## Parameters

- SiteConfiguration: Workbook input carried forward from: Affected username, backup path, app vendor paths

## Example

```powershell
./healthcare-app-remediation-inteleviewer-user-profile-reset-skeleton.ps1
```

## Workbook Notes

Exact cache/config paths should be validated per installed version.

Backup before reset. Validate application-specific config paths.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
