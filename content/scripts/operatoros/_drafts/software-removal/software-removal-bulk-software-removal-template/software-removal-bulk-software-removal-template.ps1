# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-026
# Title: Bulk Software Removal Template
# Category: Software Removal
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

$AppNamePattern = "Example App"
$UninstallPaths = @(
 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*',
 'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*'
)

$apps = Get-ItemProperty $UninstallPaths -ErrorAction SilentlyContinue |
Where-Object { $_.DisplayName -like "*$AppNamePattern*" } |
Select-Object DisplayName, DisplayVersion, UninstallString, QuietUninstallString

$apps | Format-Table -AutoSize

# Review first. Then build vendor-specific silent uninstall logic.
