# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: Server Inventory Report

$ErrorActionPreference = 'Stop'

Get-ComputerInfo | Select-Object CsName,WindowsProductName,WindowsVersion,OsHardwareAbstractionLayer

