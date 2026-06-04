# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: Top Process Resource Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-Process | Sort-Object CPU -Descending | Select-Object -First 25 Name,Id,CPU,WorkingSet
