# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Authentication Method Policy Review

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MgIdentityAuthenticationMethodPolicy | Select-Object Id,DisplayName,Description
