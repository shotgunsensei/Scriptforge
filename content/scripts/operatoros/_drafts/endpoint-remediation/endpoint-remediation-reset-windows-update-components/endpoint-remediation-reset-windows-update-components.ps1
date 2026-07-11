# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-019
# Title: Reset Windows Update Components
# Category: Endpoint Remediation
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

$services = "wuauserv","bits","cryptsvc","msiserver"

foreach ($svc in $services) { Stop-Service $svc -Force -ErrorAction SilentlyContinue }

Rename-Item "C:\Windows\SoftwareDistribution" "SoftwareDistribution.old" -ErrorAction SilentlyContinue
Rename-Item "C:\Windows\System32\catroot2" "catroot2.old" -ErrorAction SilentlyContinue

foreach ($svc in $services) { Start-Service $svc -ErrorAction SilentlyContinue }

UsoClient StartScan
