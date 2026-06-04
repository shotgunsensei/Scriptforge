# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: Device Inventory Report

$ErrorActionPreference = 'Stop'

Get-MgDevice -All -Property DisplayName,OperatingSystem,TrustType | Select-Object DisplayName,OperatingSystem,TrustType

