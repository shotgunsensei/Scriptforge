# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Service Principal Inventory

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MgServicePrincipal -All | Select-Object DisplayName,AppId,PublisherName,AccountEnabled
