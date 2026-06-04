# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Mailbox Size Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-EXOMailbox -ResultSize Unlimited | Get-EXOMailboxStatistics | Select-Object DisplayName,TotalItemSize,ItemCount
