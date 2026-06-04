# OperatorOS ScriptForge official read-only audit script
# Category: Kaseya / Datto RMM
# Report: RMM Patch Snapshot

$ErrorActionPreference = 'Stop'

Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 25 HotFixID,InstalledOn,Description

