# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: DNS Server Audit

$ErrorActionPreference = 'Stop'

Get-DnsClientServerAddress | Select-Object InterfaceAlias,ServerAddresses

