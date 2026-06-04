# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: Firewall Profile Network Review

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction
