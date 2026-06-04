# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: Uptime Report

$ErrorActionPreference = 'Stop'

Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,LastBootUpTime

