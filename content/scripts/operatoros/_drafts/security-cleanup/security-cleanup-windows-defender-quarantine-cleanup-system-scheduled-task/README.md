# Windows Defender Quarantine Cleanup - SYSTEM Scheduled Task

Removes orphaned/stale Defender quarantine storage when Defender history is empty but quarantine folder is consuming excessive disk.

## Source

- Official OperatorOS script: trusted draft
- Workbook ref: SCR-009
- Category: security-cleanup
- Review status: trusted_draft
- Reviewed by: Pending OperatorOS reviewer
- Ready state: Needs Review
- Sensitivity: Restricted
- Body type: PowerShell / Command Block

## Use Case

Use this Security / Cleanup component for the documented workflow: Removes orphaned/stale Defender quarantine storage when Defender history is empty but quarantine folder is consuming excessive disk. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: critical
- Scan status: warnings
- Requires admin: yes
- Touches network: no
- Touches registry: no
- Touches filesystem: yes

Held as a trusted draft until an authorized reviewer validates site variables, redactions, and blast radius. Workbook ref SCR-009. Ready state: Needs Review. Sensitivity: Restricted. Static scanner matched: Remove-Item, Scheduled task creation. Use only after confirming no active investigation/evidence hold. Prefer Defender-native cleanup first. Potential evidence destruction. Confirm no security hold. Test on one endpoint before fleet use. Workbook source note: Prior conversation: Defender quarantine folder near 200 GB. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for Windows Endpoint.
- Required tooling: PowerShell / Scheduled Task.
- Recommended run context: Elevated PowerShell; creates one-time SYSTEM task.

## Parameters

- QuarantinePath: Workbook input carried forward from: $QuarantinePath, $TaskName, $DryRun
- TaskName: Workbook input carried forward from: $QuarantinePath, $TaskName, $DryRun
- DryRun: Workbook input carried forward from: $QuarantinePath, $TaskName, $DryRun

## Example

```powershell
./security-cleanup-windows-defender-quarantine-cleanup-system-scheduled-task.ps1
```

## Workbook Notes

Use only after confirming no active investigation/evidence hold. Prefer Defender-native cleanup first.

Potential evidence destruction. Confirm no security hold. Test on one endpoint before fleet use.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
