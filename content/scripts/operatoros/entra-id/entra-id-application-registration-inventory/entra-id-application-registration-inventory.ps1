# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Application Registration Inventory

$ErrorActionPreference = 'Stop'

Get-MgApplication -All | Select-Object DisplayName,AppId,SignInAudience

