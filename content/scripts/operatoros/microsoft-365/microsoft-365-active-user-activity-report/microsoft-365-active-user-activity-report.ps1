# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: Active User Activity Report

$ErrorActionPreference = 'Stop'

Get-MgReportOffice365ActiveUserDetail -Period D30

