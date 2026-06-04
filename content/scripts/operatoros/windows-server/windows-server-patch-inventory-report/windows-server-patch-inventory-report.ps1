# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: Patch Inventory Report

$ErrorActionPreference = 'Stop'

Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object HotFixID,Description,InstalledOn

