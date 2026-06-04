# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: Application Error Review

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-EventLog -LogName Application -EntryType Error -Newest 50 | Select-Object TimeGenerated,Source,EventID,Message
