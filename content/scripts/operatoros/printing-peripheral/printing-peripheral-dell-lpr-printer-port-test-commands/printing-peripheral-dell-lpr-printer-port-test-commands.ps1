# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-033
# Title: Dell / LPR Printer Port Test Commands
# Category: Printing / Peripheral
# Ready state: Ready
# Workbook risk: low
# Body type: Mixed PowerShell / CMD

$OperatorOSFrameworkCandidates = @(
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'),
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\..\framework\OperatorOS-ScriptFramework.psm1')
)
$OperatorOSFrameworkPath = $OperatorOSFrameworkCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ($OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Test-NetConnection -ComputerName 192.0.2.206 -Port 515
Test-NetConnection -ComputerName 192.0.2.206 -Port 9100

lpr.exe -S 192.0.2.206 -P print "C:\Path\To\testfile.txt"

# Wireshark filter:
# ip.addr == 192.0.2.206 && tcp.port == 515
