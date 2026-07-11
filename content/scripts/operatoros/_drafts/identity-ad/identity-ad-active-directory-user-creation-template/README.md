# Active Directory User Creation Template

Creates a domain user with default attributes, group membership, and temporary password workflow.

## Source

- Official OperatorOS script: trusted draft
- Workbook ref: SCR-027
- Category: identity-ad
- Review status: trusted_draft
- Reviewed by: Pending OperatorOS reviewer
- Ready state: Needs Review
- Sensitivity: Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Identity / AD component for the documented workflow: Creates a domain user with default attributes, group membership, and temporary password workflow. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: high
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: no

Held as a trusted draft until an authorized reviewer validates site variables, redactions, and blast radius. Workbook ref SCR-027. Ready state: Needs Review. Sensitivity: Internal. Static scanner did not match high-risk command patterns. Convert to site-specific onboarding templates. Never embed real temporary passwords in saved scripts. Workbook source note: OperatorOS MSP Automation Pack prior context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Server / Domain.
- Required tooling: PowerShell AD Module.
- Recommended run context: Domain admin/delegated admin PowerShell on management host.

## Parameters

- SamAccountName: Workbook input carried forward from: $SamAccountName, $OU, $Groups, $TempPassword
- OU: Workbook input carried forward from: $SamAccountName, $OU, $Groups, $TempPassword
- Groups: Workbook input carried forward from: $SamAccountName, $OU, $Groups, $TempPassword
- TempPassword: TempPassword must be supplied through an approved secure variable, vault, or runtime prompt. Sensitive.

## Example

```powershell
./identity-ad-active-directory-user-creation-template.ps1
```

## Workbook Notes

Convert to site-specific onboarding templates.

Never embed real temporary passwords in saved scripts.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
