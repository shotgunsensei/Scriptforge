# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Anti-Phish Policy Review

$ErrorActionPreference = 'Stop'

Get-AntiPhishPolicy | Select-Object Name,Enabled,AuthenticationFailAction

