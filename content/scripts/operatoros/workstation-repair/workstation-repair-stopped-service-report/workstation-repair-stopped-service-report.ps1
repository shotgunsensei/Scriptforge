# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: Stopped Service Report

$ErrorActionPreference = 'Stop'

Get-Service | Where-Object Status -ne 'Running' | Select-Object Name,DisplayName,Status,StartType

