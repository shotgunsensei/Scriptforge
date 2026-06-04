# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Inactive User Audit

$ErrorActionPreference = 'Stop'

Search-ADAccount -AccountInactive -UsersOnly -TimeSpan 90.00:00:00 | Select-Object Name,SamAccountName,LastLogonDate

