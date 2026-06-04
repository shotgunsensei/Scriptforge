# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Quarantine Summary

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-QuarantineMessage -PageSize 100 | Select-Object ReceivedTime,SenderAddress,Subject,Type
