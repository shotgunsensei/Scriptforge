# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: Route Table Report

$ErrorActionPreference = 'Stop'

Get-NetRoute | Select-Object DestinationPrefix,NextHop,RouteMetric,InterfaceAlias

