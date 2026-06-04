# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Application Registration Inventory

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MgApplication -All | Select-Object DisplayName,AppId,SignInAudience
