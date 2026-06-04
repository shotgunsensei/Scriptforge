# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: TCP Connection Report

$ErrorActionPreference = 'Stop'

Get-NetTCPConnection | Select-Object LocalAddress,LocalPort,RemoteAddress,RemotePort,State,OwningProcess

