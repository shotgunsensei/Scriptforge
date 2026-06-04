# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Stale User Sign-In Audit

$ErrorActionPreference = 'Stop'

Get-MgUser -All -Property DisplayName,UserPrincipalName,AccountEnabled,SignInActivity | Select-Object DisplayName,UserPrincipalName,AccountEnabled,SignInActivity

