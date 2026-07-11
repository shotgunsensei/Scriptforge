# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-003
# Title: HUNTAgent Service Refresh
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

Restart-Service HUNTAgent -Force
Start-Sleep -Seconds 30
Get-Service HUNTAgent | Format-List Name,DisplayName,Status,StartType
