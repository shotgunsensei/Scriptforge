# OperatorOS ScriptForge official read-only audit script
# Category: Kaseya / Datto RMM
# Report: RMM Service Control Capability Report

$ErrorActionPreference = 'Stop'

Get-Service | Where-Object Name -match 'Kaseya|Datto|AEM' | Select-Object Name,Status,CanStop,ServiceType

