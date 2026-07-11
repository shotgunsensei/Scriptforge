# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-017
# Title: Disk Cleanup Lite
# Category: Endpoint Maintenance
# Ready state: Ready
# Workbook risk: medium
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

$Targets = @(
    "C:\Windows\Temp\*",
    "C:\Temp\*",
    "C:\Windows\SoftwareDistribution\Download\*"
)

$before = (Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'").FreeSpace

foreach ($Target in $Targets) {
    Remove-Item $Target -Force -Recurse -ErrorAction SilentlyContinue
}

$after = (Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'").FreeSpace
[pscustomobject]@{
    BeforeGB = [math]::Round($before / 1GB, 2)
    AfterGB  = [math]::Round($after / 1GB, 2)
    RecoveredGB = [math]::Round(($after - $before) / 1GB, 2)
}
