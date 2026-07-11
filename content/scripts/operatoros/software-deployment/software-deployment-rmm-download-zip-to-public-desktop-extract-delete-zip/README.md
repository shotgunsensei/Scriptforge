# RMM Download ZIP to Public Desktop, Extract, Delete ZIP

Downloads a ZIP from a link, extracts it to Public Desktop, and removes the ZIP so only extracted folder remains.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-012
- Category: software-deployment
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready - URL Placeholder
- Sensitivity: Internal
- Body type: PowerShell / Command Block

## Use Case

Use this Software Deployment component for the documented workflow: Downloads a ZIP from a link, extracts it to Public Desktop, and removes the ZIP so only extracted folder remains. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: medium
- Scan status: warnings
- Requires admin: yes
- Touches network: yes
- Touches registry: no
- Touches filesystem: yes

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-012. Ready state: Ready - URL Placeholder. Sensitivity: Internal. Static scanner matched: Remove-Item, Invoke-WebRequest. Use direct download links where possible; SharePoint sharing URLs sometimes need conversion. Review before production use. Workbook source note: Prior conversation: RMM component download/unzip public desktop. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell / Datto RMM.
- Recommended run context: Datto RMM LocalSystem or Admin.

## Parameters

- DownloadUrl: Workbook input carried forward from: $DownloadUrl, $DestinationFolder
- DestinationFolder: Workbook input carried forward from: $DownloadUrl, $DestinationFolder

## Example

```powershell
./software-deployment-rmm-download-zip-to-public-desktop-extract-delete-zip.ps1
```

## Workbook Notes

Use direct download links where possible; SharePoint sharing URLs sometimes need conversion.

Review before production use.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
