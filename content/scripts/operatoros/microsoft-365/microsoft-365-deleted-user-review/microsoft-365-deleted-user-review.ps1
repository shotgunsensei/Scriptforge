# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: Deleted User Review

$ErrorActionPreference = 'Stop'

Get-MgDirectoryDeletedItemAsUser -All | Select-Object DisplayName,UserPrincipalName,DeletedDateTime

