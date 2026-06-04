# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Firewall Profile Audit

$ErrorActionPreference = 'Stop'

Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction,DefaultOutboundAction

