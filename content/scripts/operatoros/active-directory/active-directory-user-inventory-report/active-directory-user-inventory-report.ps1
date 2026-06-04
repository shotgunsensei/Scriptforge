# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: User Inventory Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-ADUser -Filter * -Properties Enabled,LastLogonDate | Select-Object Name,SamAccountName,Enabled,LastLogonDate
