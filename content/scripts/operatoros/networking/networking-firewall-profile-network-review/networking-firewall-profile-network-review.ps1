# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: Firewall Profile Network Review

$ErrorActionPreference = 'Stop'

Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction

