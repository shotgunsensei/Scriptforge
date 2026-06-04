# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: License Utilization Report

$ErrorActionPreference = 'Stop'

Get-MgSubscribedSku | Select-Object SkuPartNumber,ConsumedUnits,PrepaidUnits

