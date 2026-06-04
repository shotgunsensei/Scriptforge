# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: IP Configuration Report

$ErrorActionPreference = 'Stop'

Get-CimInstance Win32_NetworkAdapterConfiguration | Where-Object IPEnabled | Select-Object Description,IPAddress,DefaultIPGateway,DNSServerSearchOrder

