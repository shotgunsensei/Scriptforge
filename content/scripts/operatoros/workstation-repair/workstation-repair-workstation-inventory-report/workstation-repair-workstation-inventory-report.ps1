# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: Workstation Inventory Report

$ErrorActionPreference = 'Stop'

Get-ComputerInfo | Select-Object CsName,WindowsProductName,WindowsVersion,CsManufacturer,CsModel

