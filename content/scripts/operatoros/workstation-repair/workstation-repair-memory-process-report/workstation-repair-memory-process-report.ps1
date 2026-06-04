# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: Memory Process Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 20 Name,Id,WorkingSet
