
param(
  [string]$ComputerName = 'localhost',
  [int]$Port = 443
)

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}


# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: Port Connectivity Test

$ErrorActionPreference = 'Stop'

Test-NetConnection -ComputerName $ComputerName -Port $Port | Select-Object ComputerName,RemotePort,TcpTestSucceeded
