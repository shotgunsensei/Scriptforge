# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: Group Inventory Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MgGroup -All -Property DisplayName,MailEnabled,SecurityEnabled | Select-Object DisplayName,MailEnabled,SecurityEnabled
