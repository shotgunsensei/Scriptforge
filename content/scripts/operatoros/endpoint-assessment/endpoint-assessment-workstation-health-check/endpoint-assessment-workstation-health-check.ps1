# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-023
# Title: Workstation Health Check
# Category: Endpoint Assessment
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

$os = Get-CimInstance Win32_OperatingSystem
$disk = Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'"
$rebootKeys = @(
 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\RebootPending',
 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update\RebootRequired'
)
[pscustomobject]@{
    ComputerName = $env:COMPUTERNAME
    OS = $os.Caption
    Build = $os.BuildNumber
    LastBoot = $os.LastBootUpTime
    UptimeDays = [math]::Round(((Get-Date) - $os.LastBootUpTime).TotalDays, 1)
    C_FreeGB = [math]::Round($disk.FreeSpace / 1GB, 2)
    C_TotalGB = [math]::Round($disk.Size / 1GB, 2)
    PendingReboot = [bool]($rebootKeys | Where-Object { Test-Path $_ })
}
