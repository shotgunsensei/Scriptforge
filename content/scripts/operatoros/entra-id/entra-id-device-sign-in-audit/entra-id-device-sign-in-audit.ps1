# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Device Sign-In Audit

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MgDevice -All | Select-Object DisplayName,OperatingSystem,ApproximateLastSignInDateTime
