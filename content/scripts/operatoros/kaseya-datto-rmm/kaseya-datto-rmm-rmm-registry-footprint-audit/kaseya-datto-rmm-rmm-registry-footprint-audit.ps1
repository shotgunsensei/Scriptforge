# OperatorOS ScriptForge official read-only audit script
# Category: Kaseya / Datto RMM
# Report: RMM Registry Footprint Audit

$ErrorActionPreference = 'Stop'

Get-ChildItem 'HKLM:\Software' -ErrorAction SilentlyContinue | Where-Object Name -match 'Kaseya|Datto' | Select-Object Name

