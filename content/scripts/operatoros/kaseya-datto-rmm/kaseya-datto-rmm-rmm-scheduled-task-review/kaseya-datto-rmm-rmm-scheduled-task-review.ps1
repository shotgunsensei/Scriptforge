# OperatorOS ScriptForge official read-only audit script
# Category: Kaseya / Datto RMM
# Report: RMM Scheduled Task Review

$ErrorActionPreference = 'Stop'

Get-ScheduledTask | Where-Object TaskName -match 'Kaseya|Datto|RMM' | Select-Object TaskName,TaskPath,State

