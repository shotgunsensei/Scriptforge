# IR PowerShell String Review Indicators

Searches exported PowerShell logs for common suspicious strings while distinguishing RMM management activity.

## Source

- Official OperatorOS script: trusted draft
- Workbook ref: SCR-031
- Category: incident-response
- Review status: trusted_draft
- Reviewed by: Pending OperatorOS reviewer
- Ready state: Ready - Pattern List
- Sensitivity: Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Incident Response component for the documented workflow: Searches exported PowerShell logs for common suspicious strings while distinguishing RMM management activity. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: medium
- Scan status: failed
- Requires admin: yes
- Touches network: yes
- Touches registry: no
- Touches filesystem: no

Held as a trusted draft until an authorized reviewer validates site variables, redactions, and blast radius. Workbook ref SCR-031. Ready state: Ready - Pattern List. Sensitivity: Internal. Static scanner matched: Invoke-Expression, Invoke-WebRequest, EncodedCommand. Use to supplement event review. Absence of these strings does not prove clean environment. Treat as triage, not a full forensic verdict. Workbook source note: File Library: IR source_IR_Triage_Findings_20260611.md. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Server / Endpoint Logs.
- Required tooling: PowerShell / CSV Review.
- Recommended run context: Analyst workstation with exported logs.

## Parameters

- SiteConfiguration: Workbook input carried forward from: Path to exported logs

## Example

```powershell
./incident-response-ir-powershell-string-review-indicators.ps1
```

## Workbook Notes

Use to supplement event review. Absence of these strings does not prove clean environment.

Treat as triage, not a full forensic verdict.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
