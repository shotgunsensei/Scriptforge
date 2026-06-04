# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: Network Adapter Report

$ErrorActionPreference = 'Stop'

Get-NetAdapter | Select-Object Name,Status,LinkSpeed,MacAddress

