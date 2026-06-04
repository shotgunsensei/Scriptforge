# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Directory Audit Log Export

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MgAuditLogDirectoryAudit -Top 50 | Select-Object ActivityDateTime,ActivityDisplayName,Result
