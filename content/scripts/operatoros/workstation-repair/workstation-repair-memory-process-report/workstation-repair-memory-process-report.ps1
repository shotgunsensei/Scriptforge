# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: Memory Process Report

$ErrorActionPreference = 'Stop'

Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 20 Name,Id,WorkingSet

