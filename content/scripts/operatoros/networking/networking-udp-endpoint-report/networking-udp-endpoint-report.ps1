# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: UDP Endpoint Report

$ErrorActionPreference = 'Stop'

Get-NetUDPEndpoint | Select-Object LocalAddress,LocalPort,OwningProcess

