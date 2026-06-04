# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Group Membership Export

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-ADGroupMember -Identity $GroupName -Recursive | Select-Object Name,SamAccountName,ObjectClass
