# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: IP Interface Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-NetIPInterface | Select-Object InterfaceAlias,AddressFamily,Dhcp,ConnectionState
