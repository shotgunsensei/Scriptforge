# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: Printer Inventory Report

$ErrorActionPreference = 'Stop'

Get-Printer | Select-Object Name,DriverName,PortName,PrinterStatus

