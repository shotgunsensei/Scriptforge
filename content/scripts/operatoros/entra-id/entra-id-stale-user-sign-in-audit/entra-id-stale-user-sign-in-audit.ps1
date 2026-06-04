# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Stale User Sign-In Audit

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MgUser -All -Property DisplayName,UserPrincipalName,AccountEnabled,SignInActivity | Select-Object DisplayName,UserPrincipalName,AccountEnabled,SignInActivity
