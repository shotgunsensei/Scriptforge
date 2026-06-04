# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: License Utilization Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MgSubscribedSku | Select-Object SkuPartNumber,ConsumedUnits,PrepaidUnits
