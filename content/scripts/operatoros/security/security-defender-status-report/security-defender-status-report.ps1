# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Defender Status Report

$ErrorActionPreference = 'Stop'

Get-MpComputerStatus | Select-Object AMServiceEnabled,AntivirusEnabled,RealTimeProtectionEnabled,QuickScanAge

