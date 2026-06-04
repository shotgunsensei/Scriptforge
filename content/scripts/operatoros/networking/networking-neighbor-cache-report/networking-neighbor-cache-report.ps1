# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: Neighbor Cache Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-NetNeighbor | Select-Object ifIndex,IPAddress,LinkLayerAddress,State
