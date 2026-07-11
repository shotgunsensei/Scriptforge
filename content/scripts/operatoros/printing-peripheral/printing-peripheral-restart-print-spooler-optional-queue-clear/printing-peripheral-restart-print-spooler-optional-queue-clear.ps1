# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-016
# Title: Restart Print Spooler + Optional Queue Clear
# Category: Printing / Peripheral
# Ready state: Ready
# Workbook risk: medium
# Body type: PowerShell / Command Block

pa

$OperatorOSFrameworkCandidates = @(
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'),
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\..\framework\OperatorOS-ScriptFramework.psm1')
)
$OperatorOSFrameworkPath = $OperatorOSFrameworkCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ($OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

ram([switch]$ClearQueue)

Stop-Service Spooler -Force -ErrorAction SilentlyContinue

if ($ClearQueue) {
    Remove-Item "$env:SystemRoot\System32\spool\PRINTERS\*" -Force -Recurse -ErrorAction SilentlyContinue
}

Start-Service Spooler
Get-Service Spooler | Format-List Name,Status,StartType
