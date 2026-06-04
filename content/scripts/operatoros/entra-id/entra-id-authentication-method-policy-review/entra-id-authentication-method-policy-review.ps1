# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Authentication Method Policy Review

$ErrorActionPreference = 'Stop'

Get-MgIdentityAuthenticationMethodPolicy | Select-Object Id,DisplayName,Description

