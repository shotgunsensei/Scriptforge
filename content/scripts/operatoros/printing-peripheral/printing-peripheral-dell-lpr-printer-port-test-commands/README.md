# Dell / LPR Printer Port Test Commands

Tests LPR printing over TCP 515 and falls back to RAW 9100 validation.

## Source

- Official OperatorOS script: yes
- Workbook ref: SCR-033
- Category: printing-peripheral
- Review status: approved
- Reviewed by: OperatorOS Xodus Import
- Ready state: Ready
- Sensitivity: General Internal
- Body type: Mixed PowerShell / CMD

## Use Case

Use this Printing / Peripheral component for the documented workflow: Tests LPR printing over TCP 515 and falls back to RAW 9100 validation. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: low
- Scan status: passed
- Requires admin: no
- Touches network: yes
- Touches registry: no
- Touches filesystem: no

Approved for the OperatorOS catalog after workbook import normalization. Workbook ref SCR-033. Ready state: Ready. Sensitivity: General Internal. Static scanner did not match high-risk command patterns. Useful for ActiveFax/printer transport troubleshooting too. Review before production use. Workbook source note: Prior printer troubleshooting context. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: CMD / PowerShell.
- Recommended run context: Technician CMD/PowerShell.

## Parameters

- SiteConfiguration: Workbook input carried forward from: Printer IP, queue name, test file path

## Example

```powershell
./printing-peripheral-dell-lpr-printer-port-test-commands.ps1
```

## Workbook Notes

Useful for ActiveFax/printer transport troubleshooting too.

Review before production use.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
