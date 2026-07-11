# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-002
# Title: Datto EDR / HUNTAgent State Validation
# Category: Security / EDR
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

Write-Host "`n=== Checking for Datto EDR / HUNTAgent service ===" -ForegroundColor Cyan

Get-Service -ErrorAction SilentlyContinue |
Where-Object {
    $_.Name -match "HUNT|Datto|Kaseya|EDR|Infocyte|Rocket|Cyber" -or
    $_.DisplayName -match "HUNT|Datto|Kaseya|EDR|Infocyte|Rocket|Cyber"
} |
Sort-Object DisplayName |
Format-Table Name, DisplayName, Status, StartType -AutoSize

Write-Host "`n=== Checking Datto/Kaseya/EDR processes ===" -ForegroundColor Cyan

Get-Process -ErrorAction SilentlyContinue |
Where-Object {
    $_.ProcessName -match "HUNT|Datto|Kaseya|EDR|Infocyte|Rocket|Cyber|Agent"
} |
Select-Object Id, ProcessName, Path |
Format-Table -AutoSize

Write-Host "`n=== Checking installed software entries ===" -ForegroundColor Cyan

$UninstallPaths = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*"
)

Get-ItemProperty $UninstallPaths -ErrorAction SilentlyContinue |
Where-Object {
    $_.DisplayName -match "Datto|Kaseya|EDR|Endpoint|Infocyte|Rocket|Cyber"
} |
Select-Object DisplayName, DisplayVersion, Publisher, InstallDate, UninstallString |
Format-List
