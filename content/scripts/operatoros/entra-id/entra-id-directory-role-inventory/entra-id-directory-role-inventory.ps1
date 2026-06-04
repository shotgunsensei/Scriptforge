# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Directory Role Inventory

$ErrorActionPreference = 'Stop'

Get-MgDirectoryRole | Select-Object DisplayName,Id

