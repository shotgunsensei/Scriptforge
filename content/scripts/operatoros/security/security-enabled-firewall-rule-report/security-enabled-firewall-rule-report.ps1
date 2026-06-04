# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Enabled Firewall Rule Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-NetFirewallRule | Where-Object Enabled -eq True | Select-Object DisplayName,Direction,Action,Profile
