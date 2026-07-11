# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-025
# Title: BitLocker Status Reporting
# Category: Security / Endpoint
# Ready state: Ready
# Workbook risk: low
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

Get-BitLockerVolume |
Select-Object MountPoint,VolumeStatus,ProtectionStatus,EncryptionPercentage,LockStatus
