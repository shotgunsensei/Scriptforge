# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Local User Audit

$ErrorActionPreference = 'Stop'

Get-LocalUser | Select-Object Name,Enabled,LastLogon,PasswordRequired

