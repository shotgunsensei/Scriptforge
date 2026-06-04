# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: Connection Profile Audit

$ErrorActionPreference = 'Stop'

Get-NetConnectionProfile | Select-Object Name,InterfaceAlias,NetworkCategory,IPv4Connectivity

