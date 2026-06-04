# OperatorOS ScriptForge official read-only audit script
# Category: Kaseya / Datto RMM
# Report: RMM Process Audit

$ErrorActionPreference = 'Stop'

Get-Process | Where-Object ProcessName -match 'Kaseya|Datto|AEM|RMM' | Select-Object ProcessName,Id,CPU,Path

