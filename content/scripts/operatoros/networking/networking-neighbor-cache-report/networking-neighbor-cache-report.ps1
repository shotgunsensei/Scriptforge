# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: Neighbor Cache Report

$ErrorActionPreference = 'Stop'

Get-NetNeighbor | Select-Object ifIndex,IPAddress,LinkLayerAddress,State

