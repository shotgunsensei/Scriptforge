# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Device Sign-In Audit

$ErrorActionPreference = 'Stop'

Get-MgDevice -All | Select-Object DisplayName,OperatingSystem,ApproximateLastSignInDateTime

