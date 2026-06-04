# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: Scheduled Task Inventory

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-ScheduledTask | Select-Object TaskName,TaskPath,State
