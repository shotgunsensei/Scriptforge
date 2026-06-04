# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: Patch Inventory Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object HotFixID,Description,InstalledOn
