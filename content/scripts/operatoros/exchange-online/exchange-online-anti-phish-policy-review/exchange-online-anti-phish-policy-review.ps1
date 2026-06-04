# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Anti-Phish Policy Review

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-AntiPhishPolicy | Select-Object Name,Enabled,AuthenticationFailAction
