# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: OneDrive Usage Report

$ErrorActionPreference = 'Stop'

Get-MgReportOneDriveUsageAccountDetail -Period D30

