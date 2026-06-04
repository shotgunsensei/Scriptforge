# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Computer Inventory Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-ADComputer -Filter * -Properties OperatingSystem,LastLogonDate | Select-Object Name,OperatingSystem,LastLogonDate
