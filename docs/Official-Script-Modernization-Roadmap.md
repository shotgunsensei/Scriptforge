# Official Script Modernization Roadmap

Generated: 2026-06-04T20:43:56.915Z

## Summary

- Official scripts reviewed: 108
- Scripts requiring rewrite: 99
- Scripts requiring enhancement: 9
- Scripts already acceptable: 0

## Scoring Model

- Quality score measures framework adoption, logging, validation, reporting, scoring, evidence collection, and operator guidance.
- Safety score measures safety mode, rollback, WhatIf/DryRun, exception tracking, dependency validation, and risky command posture.
- Complexity score estimates operational complexity from script size, parameters, module requirements, and safety flags.
- Production readiness combines quality, safety, and documentation completeness.

## Scripts Requiring Rewrite

| Script | Category | Quality | Safety | Complexity | Readiness | Top Actions |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Active Directory Computer Inventory Report | active-directory | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Active Directory Domain FSMO Audit | active-directory | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Active Directory Forest FSMO Audit | active-directory | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Active Directory Group Inventory Report | active-directory | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Active Directory Group Membership Export | active-directory | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Active Directory Inactive Computer Audit | active-directory | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Active Directory Inactive User Audit | active-directory | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Active Directory Locked Account Report | active-directory | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Active Directory OU Inventory Report | active-directory | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Active Directory Password Policy Audit | active-directory | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Active Directory Replication Failure Report | active-directory | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Active Directory User Inventory Report | active-directory | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Entra ID Application Registration Inventory | entra-id | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Entra ID Authentication Method Policy Review | entra-id | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Entra ID Conditional Access Policy Audit | entra-id | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Entra ID Device Sign-In Audit | entra-id | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Entra ID Directory Audit Log Export | entra-id | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Entra ID Directory Role Inventory | entra-id | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Entra ID Privileged Role Member Report | entra-id | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Entra ID Recent Sign-In Report | entra-id | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Entra ID Security Group Inventory | entra-id | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Entra ID Service Principal Inventory | entra-id | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Entra ID Stale User Sign-In Audit | entra-id | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Exchange Online Anti-Phish Policy Review | exchange-online | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Exchange Online Distribution Group Audit | exchange-online | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Exchange Online Dynamic Group Audit | exchange-online | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Exchange Online Inbox Rule Forwarding Audit | exchange-online | 5 | 73 | 27 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Exchange Online Mailbox Inventory Report | exchange-online | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Exchange Online Mailbox Size Report | exchange-online | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Exchange Online Organization Config Audit | exchange-online | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Exchange Online Quarantine Summary | exchange-online | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Exchange Online Spam Policy Review | exchange-online | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Exchange Online Transport Rule Review | exchange-online | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Kaseya / Datto RMM RMM Application Event Review | kaseya-datto-rmm | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Kaseya / Datto RMM RMM Disk Capacity Snapshot | kaseya-datto-rmm | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Kaseya / Datto RMM RMM Installed Product Audit | kaseya-datto-rmm | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Kaseya / Datto RMM RMM Network Connection Report | kaseya-datto-rmm | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Kaseya / Datto RMM RMM Patch Snapshot | kaseya-datto-rmm | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Kaseya / Datto RMM RMM Process Audit | kaseya-datto-rmm | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Kaseya / Datto RMM RMM ProgramData Footprint Audit | kaseya-datto-rmm | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Kaseya / Datto RMM RMM Registry Footprint Audit | kaseya-datto-rmm | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Kaseya / Datto RMM RMM Scheduled Task Review | kaseya-datto-rmm | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Kaseya / Datto RMM RMM Service Control Capability Report | kaseya-datto-rmm | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Kaseya / Datto RMM RMM Service Status Audit | kaseya-datto-rmm | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Microsoft 365 Active User Activity Report | microsoft-365 | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Microsoft 365 Deleted User Review | microsoft-365 | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Microsoft 365 Device Inventory Report | microsoft-365 | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Microsoft 365 Domain Verification Audit | microsoft-365 | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Microsoft 365 Email Activity Report | microsoft-365 | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Microsoft 365 Group Inventory Report | microsoft-365 | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Microsoft 365 License Utilization Report | microsoft-365 | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Microsoft 365 OneDrive Usage Report | microsoft-365 | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Microsoft 365 SharePoint Usage Report | microsoft-365 | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Microsoft 365 Teams Activity Report | microsoft-365 | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Microsoft 365 User Enablement Audit | microsoft-365 | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Networking Adapter Statistics Report | networking | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Networking Connection Profile Audit | networking | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Networking DNS Resolution Test | networking | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Networking DNS Server Audit | networking | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Networking Firewall Profile Network Review | networking | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Networking IP Configuration Audit | networking | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Networking IP Interface Report | networking | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Networking Neighbor Cache Report | networking | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Networking Port Connectivity Test | networking | 5 | 73 | 26 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Networking Route Table Report | networking | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Networking TCP Connection Report | networking | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Networking UDP Endpoint Report | networking | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Security Defender Status Report | security | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Security Defender Threat Report | security | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Security Enabled Firewall Rule Report | security | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Security File Signature Check | security | 5 | 73 | 19 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Security Firewall Profile Audit | security | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Security Local Administrators Audit | security | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Security Local User Audit | security | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Security Running Process Path Audit | security | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Security Security Event Snapshot | security | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Security Security Patch Report | security | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Security Share Exposure Audit | security | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Windows Server Application Error Event Review | windows-server | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Windows Server Installed Role Audit | windows-server | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Windows Server Patch Inventory Report | windows-server | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Windows Server Scheduled Task Inventory | windows-server | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Windows Server Service State Report | windows-server | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Windows Server SMB Session Report | windows-server | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Windows Server SMB Share Audit | windows-server | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Windows Server System Error Event Review | windows-server | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Windows Server Top Process Resource Report | windows-server | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Windows Server Volume Capacity Report | windows-server | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Workstation Repair Application Error Review | workstation-repair | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Workstation Repair BIOS Serial Report | workstation-repair | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Workstation Repair Disk Capacity Report | workstation-repair | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Workstation Repair IP Configuration Report | workstation-repair | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Workstation Repair Memory Process Report | workstation-repair | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Workstation Repair Network Adapter Report | workstation-repair | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Workstation Repair Patch History Report | workstation-repair | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Workstation Repair Printer Inventory Report | workstation-repair | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Workstation Repair Startup Item Audit | workstation-repair | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Workstation Repair Stopped Service Report | workstation-repair | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Workstation Repair System Error Review | workstation-repair | 5 | 73 | 11 | 48 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |


## Scripts Requiring Enhancement

| Script | Category | Quality | Safety | Complexity | Readiness | Top Actions |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Entra ID OAuth Grant Inventory | entra-id | 10 | 76 | 19 | 51 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Exchange Online Mailbox Permission Audit | exchange-online | 10 | 76 | 27 | 51 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Exchange Online Send-As Permission Audit | exchange-online | 10 | 76 | 27 | 51 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Kaseya / Datto RMM RMM Endpoint Uptime Report | kaseya-datto-rmm | 10 | 73 | 11 | 50 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Microsoft 365 Tenant Profile Audit | microsoft-365 | 10 | 73 | 19 | 50 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Security Certificate Expiration Report | security | 10 | 73 | 11 | 50 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Windows Server Server Inventory Report | windows-server | 10 | 73 | 11 | 50 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Windows Server Uptime Report | windows-server | 10 | 73 | 11 | 50 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |
| Workstation Repair Workstation Inventory Report | workstation-repair | 10 | 73 | 11 | 50 | Uses CmdletBinding; Uses structured logging; Wraps execution in try/catch; Supports WhatIf |


## Scripts Already Acceptable

No scripts in this category.


## Modernization Requirements

Every official OperatorOS script should:

- Import `OperatorOS-ScriptFramework.psm1`.
- Use `[CmdletBinding(SupportsShouldProcess = $true)]`.
- Support `-ConfigPath`, environment-derived config, parameter overrides, `-DryRun`, and native `-WhatIf`.
- Use structured OperatorOS logging and transcript support for technician evidence.
- Validate PowerShell version, required modules, and required permissions before execution.
- Collect tenant, machine, timing, exception, and evidence data.
- Export HTML, CSV, and JSON reports where the output is reportable.
- Return an operator summary with risk score, health score, findings, warnings, and next actions.
- Define rollback behavior for any remediation or emergency workflow.

## Modernization Templates

- `templates/modernization/microsoft-365-enterprise-template.ps1`
- `templates/modernization/exchange-online-enterprise-template.ps1`
- `templates/modernization/entra-id-enterprise-template.ps1`
- `templates/modernization/active-directory-enterprise-template.ps1`
- `templates/modernization/windows-server-enterprise-template.ps1`
- `templates/modernization/datto-rmm-enterprise-template.ps1`
- `templates/modernization/security-auditing-enterprise-template.ps1`
