# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: Route Table Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-NetRoute | Select-Object DestinationPrefix,NextHop,RouteMetric,InterfaceAlias
