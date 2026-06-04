# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Group Inventory Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-ADGroup -Filter * -Properties GroupCategory,GroupScope | Select-Object Name,GroupCategory,GroupScope
