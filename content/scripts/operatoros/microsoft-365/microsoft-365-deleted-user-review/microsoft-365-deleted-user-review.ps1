# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: Deleted User Review

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MgDirectoryDeletedItemAsUser -All | Select-Object DisplayName,UserPrincipalName,DeletedDateTime
