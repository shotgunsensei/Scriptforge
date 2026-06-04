# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Defender Threat Report

$ErrorActionPreference = 'Stop'

Get-MpThreat | Select-Object ThreatName,SeverityID,Resources,InitialDetectionTime

