# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Replication Failure Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-ADReplicationFailure -Scope Forest | Select-Object Server,Partner,FailureCount,LastError
