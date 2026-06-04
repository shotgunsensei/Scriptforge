# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: Adapter Statistics Report

$ErrorActionPreference = 'Stop'

Get-NetAdapterStatistics | Select-Object Name,ReceivedBytes,SentBytes,ReceivedUnicastPackets,SentUnicastPackets

