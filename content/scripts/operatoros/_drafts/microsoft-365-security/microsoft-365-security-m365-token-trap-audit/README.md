# M365 Token Trap Audit

Audits risky OAuth consent, device-code/legacy auth exposure, forwarding, inbox rules, privileged users, and audit logging.

## Source

- Official OperatorOS script: trusted draft
- Workbook ref: SCR-028
- Category: microsoft-365-security
- Review status: trusted_draft
- Reviewed by: Pending OperatorOS reviewer
- Ready state: Backlog / Design
- Sensitivity: Internal
- Body type: Design Stub

## Use Case

Use this Microsoft 365 / Security component for the documented workflow: Audits risky OAuth consent, device-code/legacy auth exposure, forwarding, inbox rules, privileged users, and audit logging. Run from an approved OperatorOS or RMM context and review customer-specific placeholders before execution.

## Safety

- Risk level: high
- Scan status: warnings
- Requires admin: yes
- Touches network: yes
- Touches registry: no
- Touches filesystem: no

Held as a trusted draft until an authorized reviewer validates site variables, redactions, and blast radius. Workbook ref SCR-028. Ready state: Backlog / Design. Sensitivity: Internal. Static scanner did not match high-risk command patterns. Convert into production-grade Graph script with exportable report. Requires careful permission scoping and tenant approval. Workbook source note: Prior context: Invoke-M365TokenTrapAudit.ps1. Safety scanning is one control only; review scope, tenant/customer variables, and approval requirements before execution.

## Requirements

- Windows PowerShell 5.1 or newer for M365 Tenant.
- Required tooling: Exchange Online / Graph PowerShell.
- Recommended run context: M365 admin session with least required roles.

## Parameters

- SiteConfiguration: Workbook input carried forward from: Tenant ID, scopes, admin account

## Example

```powershell
./microsoft-365-security-m365-token-trap-audit.ps1
```

## Workbook Notes

Convert into production-grade Graph script with exportable report.

Requires careful permission scoping and tenant approval.



## Output

PowerShell object, console, or command output suitable for technician review and ticket notes.

## License

Proprietary OperatorOS ScriptForge Import
