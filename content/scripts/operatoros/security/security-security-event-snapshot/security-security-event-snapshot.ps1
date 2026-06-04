# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Security Event Snapshot

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-EventLog -LogName Security -Newest 100 | Select-Object TimeGenerated,EntryType,Source,EventID,Message
