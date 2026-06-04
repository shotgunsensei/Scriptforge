# OperatorOS ScriptForge official read-only audit script
# Category: Kaseya / Datto RMM
# Report: RMM Installed Product Audit

$ErrorActionPreference = 'Stop'

Get-CimInstance Win32_Product | Where-Object Name -match 'Kaseya|Datto|RMM' | Select-Object Name,Version,Vendor

