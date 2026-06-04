# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: OAuth Grant Inventory

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MgOauth2PermissionGrant -All | Select-Object ClientId,ConsentType,Scope
