# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: Email Activity Report

$ErrorActionPreference = 'Stop'

Get-MgReportEmailActivityUserDetail -Period D30

