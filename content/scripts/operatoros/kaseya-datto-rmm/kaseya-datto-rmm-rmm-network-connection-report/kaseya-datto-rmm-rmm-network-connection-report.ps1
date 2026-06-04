# OperatorOS ScriptForge official read-only audit script
# Category: Kaseya / Datto RMM
# Report: RMM Network Connection Report

$ErrorActionPreference = 'Stop'

Get-NetTCPConnection | Where-Object OwningProcess -in (Get-Process | Where-Object ProcessName -match 'Kaseya|Datto|AEM' | Select-Object -ExpandProperty Id) | Select-Object LocalAddress,LocalPort,RemoteAddress,RemotePort,State

