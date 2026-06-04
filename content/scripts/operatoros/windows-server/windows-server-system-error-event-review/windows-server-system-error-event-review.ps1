# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: System Error Event Review

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-EventLog -LogName System -EntryType Error -Newest 100 | Select-Object TimeGenerated,Source,EventID,Message
