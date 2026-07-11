# MSI Install with Verbose Logging / Repair

Runs MSI install or repair with verbose logging for troubleshooting Return value 3 and custom action failures.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-007
- Category: software-deployment
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: General Internal
- Body type: CMD / msiexec

## Use Case

Use this Software Deployment component for the documented workflow: Runs MSI install or repair with verbose logging for troubleshooting Return value 3 and custom action failures. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: medium
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: no

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-007. Ready state: Ready. Sensitivity: General Internal. Static scanner did not match high-risk command patterns. Search the verbose log for 'Return value 3' and review 20-50 lines above failure. Review before production use. Workbook source note: File Library: CMC_Veradigm_PM_EDR_Remediation_Runbook.pdf / MSI logging thread. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: msiexec.
- Recommended run context: Elevated CMD or PowerShell.

## Parameters

- SiteConfiguration: Workbook input carried forward from: MSI path, log path, silent/interactive switch

## Example

```powershell
./software-deployment-msi-install-with-verbose-logging-repair.ps1
```

## Workbook Notes

Search the verbose log for 'Return value 3' and review 20-50 lines above failure.

Review before production use.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
