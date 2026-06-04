param(
  [string]$ComputerName = 'localhost',
  [int]$Port = 443
)

# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: Port Connectivity Test

$ErrorActionPreference = 'Stop'

Test-NetConnection -ComputerName $ComputerName -Port $Port | Select-Object ComputerName,RemotePort,TcpTestSucceeded

