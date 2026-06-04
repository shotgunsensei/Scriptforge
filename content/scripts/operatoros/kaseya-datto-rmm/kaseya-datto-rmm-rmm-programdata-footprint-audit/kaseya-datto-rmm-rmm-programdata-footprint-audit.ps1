# OperatorOS ScriptForge official read-only audit script
# Category: Kaseya / Datto RMM
# Report: RMM ProgramData Footprint Audit

$ErrorActionPreference = 'Stop'

Get-ChildItem 'C:\ProgramData' -Directory -ErrorAction SilentlyContinue | Where-Object Name -match 'Kaseya|Datto' | Select-Object FullName,LastWriteTime

