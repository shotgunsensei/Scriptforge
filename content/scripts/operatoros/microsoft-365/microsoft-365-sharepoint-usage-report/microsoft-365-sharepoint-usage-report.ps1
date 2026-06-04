# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: SharePoint Usage Report

$ErrorActionPreference = 'Stop'

Get-MgReportSharePointSiteUsageDetail -Period D30

