# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: BIOS Serial Report

$ErrorActionPreference = 'Stop'

Get-CimInstance Win32_BIOS | Select-Object SerialNumber,SMBIOSBIOSVersion,ReleaseDate

