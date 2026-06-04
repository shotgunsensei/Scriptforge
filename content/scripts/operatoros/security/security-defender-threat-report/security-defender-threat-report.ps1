# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Defender Threat Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MpThreat | Select-Object ThreatName,SeverityID,Resources,InitialDetectionTime
