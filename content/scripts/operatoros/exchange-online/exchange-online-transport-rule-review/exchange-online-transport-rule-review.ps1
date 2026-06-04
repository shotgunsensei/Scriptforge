# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Transport Rule Review

$ErrorActionPreference = 'Stop'

Get-TransportRule | Select-Object Name,State,Mode,Priority

