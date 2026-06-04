# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: Top Process Resource Report

$ErrorActionPreference = 'Stop'

Get-Process | Sort-Object CPU -Descending | Select-Object -First 25 Name,Id,CPU,WorkingSet

