# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: Domain Verification Audit

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MgDomain | Select-Object Id,IsVerified,AuthenticationType
