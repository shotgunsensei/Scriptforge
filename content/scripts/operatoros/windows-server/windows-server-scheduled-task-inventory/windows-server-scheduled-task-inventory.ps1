# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: Scheduled Task Inventory

$ErrorActionPreference = 'Stop'

Get-ScheduledTask | Select-Object TaskName,TaskPath,State

