# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: IP Configuration Audit

$ErrorActionPreference = 'Stop'

Get-NetIPConfiguration | Select-Object InterfaceAlias,IPv4Address,IPv4DefaultGateway,DNSServer

