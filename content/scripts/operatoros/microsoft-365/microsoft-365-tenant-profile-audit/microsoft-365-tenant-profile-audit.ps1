# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: Tenant Profile Audit

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MgOrganization | Select-Object Id,DisplayName,VerifiedDomains
