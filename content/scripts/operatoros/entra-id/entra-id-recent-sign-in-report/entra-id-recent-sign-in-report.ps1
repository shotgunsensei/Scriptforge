# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Recent Sign-In Report

$ErrorActionPreference = 'Stop'

Get-MgAuditLogSignIn -Top 50 | Select-Object CreatedDateTime,UserPrincipalName,AppDisplayName,Status

