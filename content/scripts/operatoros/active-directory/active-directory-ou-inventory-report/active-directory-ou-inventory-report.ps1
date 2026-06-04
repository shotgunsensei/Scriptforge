# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: OU Inventory Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-ADObject -LDAPFilter '(objectClass=organizationalUnit)' -Properties CanonicalName | Select-Object Name,CanonicalName
