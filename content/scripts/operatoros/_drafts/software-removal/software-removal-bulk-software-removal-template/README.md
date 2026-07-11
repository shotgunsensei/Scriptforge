# Bulk Software Removal Template

Finds installed apps matching a pattern and invokes uninstall strings carefully.

## Source

- Official OperatorOS script: trusted draft
- Workbook ref: SCR-026
- Category: software-removal
- Review status: trusted_draft
- Reviewed by: Pending OperatorOS reviewer
- Ready state: Needs Review
- Sensitivity: General Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Software Removal component for the documented workflow: Finds installed apps matching a pattern and invokes uninstall strings carefully. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: high
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: yes
- Touches filesystem: no

Held as a trusted draft until an authorized reviewer validates site variables, redactions, and blast radius. Workbook ref SCR-026. Ready state: Needs Review. Sensitivity: General Internal. Static scanner did not match high-risk command patterns. Do not run unattended without testing exact uninstall strings. Report-only template. Build vendor-specific silent uninstall rules before mass use. Workbook source note: OperatorOS MSP Automation Pack prior context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell / MSIExec.
- Recommended run context: Elevated PowerShell/RMM.

## Parameters

- AppNamePattern: Workbook input carried forward from: $AppNamePattern, $WhatIf
- WhatIf: Workbook input carried forward from: $AppNamePattern, $WhatIf

## Example

```powershell
./software-removal-bulk-software-removal-template.ps1
```

## Workbook Notes

Do not run unattended without testing exact uninstall strings.

Report-only template. Build vendor-specific silent uninstall rules before mass use.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
