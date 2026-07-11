# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-022
# Title: Repair Windows Defender Baseline
# Category: Security / Endpoint
# Ready state: Needs Review
# Workbook risk: high
# Body type: PowerShell / Command Block

$OperatorOSFrameworkCandidates = @(
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'),
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\..\framework\OperatorOS-ScriptFramework.psm1')
)
$OperatorOSFrameworkPath = $OperatorOSFrameworkCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ($OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MpComputerStatus | Select-Object AMServiceEnabled,AntivirusEnabled,RealTimeProtectionEnabled,AntispywareEnabled,AMEngineVersion,AntivirusSignatureLastUpdated

Set-Service WinDefend -StartupType Automatic -ErrorAction SilentlyContinue
Start-Service WinDefend -ErrorAction SilentlyContinue

Update-MpSignature -ErrorAction SilentlyContinue

Get-MpComputerStatus | Select-Object AMServiceEnabled,AntivirusEnabled,RealTimeProtectionEnabled,AntivirusSignatureLastUpdated
