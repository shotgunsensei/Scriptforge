# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Security Group Inventory

$ErrorActionPreference = 'Stop'

Get-MgGroup -All -Property DisplayName,SecurityEnabled,GroupTypes | Select-Object DisplayName,SecurityEnabled,GroupTypes

