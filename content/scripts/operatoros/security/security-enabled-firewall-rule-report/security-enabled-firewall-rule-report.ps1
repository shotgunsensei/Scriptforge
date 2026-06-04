# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Enabled Firewall Rule Report

$ErrorActionPreference = 'Stop'

Get-NetFirewallRule | Where-Object Enabled -eq True | Select-Object DisplayName,Direction,Action,Profile

