# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: Stopped Service Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-Service | Where-Object Status -ne 'Running' | Select-Object Name,DisplayName,Status,StartType
