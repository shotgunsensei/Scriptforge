# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: OAuth Grant Inventory

$ErrorActionPreference = 'Stop'

Get-MgOauth2PermissionGrant -All | Select-Object ClientId,ConsentType,Scope

