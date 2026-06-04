# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Forest FSMO Audit

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-ADForest | Select-Object Name,ForestMode,SchemaMaster,DomainNamingMaster
