# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Local User Audit

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-LocalUser | Select-Object Name,Enabled,LastLogon,PasswordRequired
