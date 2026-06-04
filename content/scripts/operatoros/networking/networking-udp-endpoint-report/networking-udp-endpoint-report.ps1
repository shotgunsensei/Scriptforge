# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: UDP Endpoint Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-NetUDPEndpoint | Select-Object LocalAddress,LocalPort,OwningProcess
