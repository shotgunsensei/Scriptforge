# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: Teams Activity Report

$ErrorActionPreference = 'Stop'

Get-MgReportTeamsUserActivityUserDetail -Period D30

