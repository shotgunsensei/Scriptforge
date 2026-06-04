# OperatorOS ScriptForge official read-only audit script
# Category: Kaseya / Datto RMM
# Report: RMM Endpoint Uptime Report

$ErrorActionPreference = 'Stop'

Get-CimInstance Win32_OperatingSystem | Select-Object CSName,LastBootUpTime,Version

