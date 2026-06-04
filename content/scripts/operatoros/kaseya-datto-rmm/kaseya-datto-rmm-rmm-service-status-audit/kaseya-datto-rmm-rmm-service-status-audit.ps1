# OperatorOS ScriptForge official read-only audit script
# Category: Kaseya / Datto RMM
# Report: RMM Service Status Audit

$ErrorActionPreference = 'Stop'

Get-Service | Where-Object DisplayName -match 'Kaseya|Datto|RMM' | Select-Object Name,DisplayName,Status,StartType

