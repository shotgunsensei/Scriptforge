# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: User Enablement Audit

$ErrorActionPreference = 'Stop'

Get-MgUser -All -Property DisplayName,UserPrincipalName,AccountEnabled | Select-Object DisplayName,UserPrincipalName,AccountEnabled

