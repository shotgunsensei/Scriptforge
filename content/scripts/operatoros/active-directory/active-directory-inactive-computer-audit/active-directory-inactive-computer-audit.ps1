# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Inactive Computer Audit

$ErrorActionPreference = 'Stop'

Search-ADAccount -AccountInactive -ComputersOnly -TimeSpan 90.00:00:00 | Select-Object Name,LastLogonDate

