# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: Network Adapter Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-NetAdapter | Select-Object Name,Status,LinkSpeed,MacAddress
