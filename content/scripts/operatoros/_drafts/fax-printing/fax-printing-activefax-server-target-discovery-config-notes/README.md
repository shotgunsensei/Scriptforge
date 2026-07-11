# ActiveFax Server Target Discovery / Config Notes

Finds ActiveFax configuration indicators and helps identify which server/IP the client is targeting.

## Source

- Official OperatorOS script: trusted draft
- Workbook ref: SCR-037
- Category: fax-printing
- Review status: trusted_draft
- Reviewed by: Pending OperatorOS reviewer
- Ready state: Needs Validation
- Sensitivity: Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Fax / Printing component for the documented workflow: Finds ActiveFax configuration indicators and helps identify which server/IP the client is targeting. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: medium
- Scan status: warnings
- Requires admin: no
- Touches network: no
- Touches registry: yes
- Touches filesystem: no

Held as a trusted draft until an authorized reviewer validates site variables, redactions, and blast radius. Workbook ref SCR-037. Ready state: Needs Validation. Sensitivity: Internal. Static scanner did not match high-risk command patterns. Exact config location may vary by ActiveFax version. Discovery only. Do not modify config until exact file/key is confirmed. Workbook source note: Prior ActiveFax troubleshooting context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell / Registry.
- Recommended run context: Technician PowerShell.

## Parameters

- SiteConfiguration: Workbook input carried forward from: Expected server name/IP

## Example

```powershell
./fax-printing-activefax-server-target-discovery-config-notes.ps1
```

## Workbook Notes

Exact config location may vary by ActiveFax version.

Discovery only. Do not modify config until exact file/key is confirmed.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
