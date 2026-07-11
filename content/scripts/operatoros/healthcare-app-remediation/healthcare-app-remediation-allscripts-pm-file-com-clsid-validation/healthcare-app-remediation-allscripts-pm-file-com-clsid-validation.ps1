# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-008
# Title: Allscripts PM File / COM / CLSID Validation
# Category: Healthcare App Remediation
# Ready state: Ready
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

$AllscriptsPath = "C:\Program Files (x86)\Allscripts\Allscripts PM"

Get-ChildItem $AllscriptsPath |
Where-Object { $_.Name -match "csim|Security|JobExec|Desktop|Monitor" } |
Select-Object Name, Length, LastWriteTime

cd /d "C:\Program Files (x86)\Allscripts\Allscripts PM"
csimSecurityMonitor.exe /RegServer
csimJobExecMgr.exe /RegServer
REM If present:
csimSecurityDesktop.exe /RegServer

reg query "HKCR\Wow6432Node\CLSID\{92D958D7-CF17-11D2-A036-0080C76912DE}" /s
reg query "HKCR\CLSID\{92D958D7-CF17-11D2-A036-0080C76912DE}" /s
