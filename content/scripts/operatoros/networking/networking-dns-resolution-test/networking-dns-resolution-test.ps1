
param(
  [string]$DnsName = 'example.com'
)

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}


# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: DNS Resolution Test

$ErrorActionPreference = 'Stop'

Resolve-DnsName -Name $DnsName | Select-Object Name,Type,IPAddress,NameHost
