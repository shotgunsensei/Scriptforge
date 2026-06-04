# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: DNS Server Audit

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-DnsClientServerAddress | Select-Object InterfaceAlias,ServerAddresses
