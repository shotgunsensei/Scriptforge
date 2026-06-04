# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Service Principal Inventory

$ErrorActionPreference = 'Stop'

Get-MgServicePrincipal -All | Select-Object DisplayName,AppId,PublisherName,AccountEnabled

