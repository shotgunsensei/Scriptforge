# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Running Process Path Audit

$ErrorActionPreference = 'Stop'

Get-Process | Where-Object Path | Select-Object Name,Id,Path,Company

