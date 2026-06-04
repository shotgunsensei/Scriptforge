# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Recent Sign-In Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MgAuditLogSignIn -Top 50 | Select-Object CreatedDateTime,UserPrincipalName,AppDisplayName,Status
