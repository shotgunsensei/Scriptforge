# Certificate Import - Trusted Root and Trusted Publisher

Imports a certificate into Local Machine Trusted Root and Trusted Publisher stores, then verifies presence by subject.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-006
- Category: certificate-trust
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Certificate / Trust component for the documented workflow: Imports a certificate into Local Machine Trusted Root and Trusted Publisher stores, then verifies presence by subject. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: high
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: no

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-006. Ready state: Ready. Sensitivity: Internal. Static scanner did not match high-risk command patterns. Useful beyond Veradigm for app deployments that require publisher trust. Only import certificates from trusted internal sources. Wrong trust-store imports create security exposure. Workbook source note: File Library: CMC_Veradigm_PM_EDR_Remediation_Runbook.pdf / prior script request. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: certutil / PowerShell.
- Recommended run context: Elevated PowerShell or CMD.

## Parameters

- CertPath: Workbook input carried forward from: $CertPath, $CertSubjectSearch
- CertSubjectSearch: Workbook input carried forward from: $CertPath, $CertSubjectSearch

## Example

```powershell
./certificate-trust-certificate-import-trusted-root-and-trusted-publisher.ps1
```

## Workbook Notes

Useful beyond Veradigm for app deployments that require publisher trust.

Only import certificates from trusted internal sources. Wrong trust-store imports create security exposure.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
