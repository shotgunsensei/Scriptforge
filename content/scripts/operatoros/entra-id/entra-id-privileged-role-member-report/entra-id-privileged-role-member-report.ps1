# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Privileged Role Member Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MgDirectoryRole | ForEach-Object { Get-MgDirectoryRoleMember -DirectoryRoleId $_.Id }
