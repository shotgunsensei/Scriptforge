# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: Server Inventory Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-ComputerInfo | Select-Object CsName,WindowsProductName,WindowsVersion,OsHardwareAbstractionLayer
