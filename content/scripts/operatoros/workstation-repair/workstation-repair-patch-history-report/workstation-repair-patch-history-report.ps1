# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: Patch History Report

$ErrorActionPreference = 'Stop'

Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object HotFixID,InstalledOn

