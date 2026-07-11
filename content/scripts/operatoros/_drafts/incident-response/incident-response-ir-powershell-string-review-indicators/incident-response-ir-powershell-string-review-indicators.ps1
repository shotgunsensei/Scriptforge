# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-031
# Title: IR PowerShell String Review Indicators
# Category: Incident Response
# Ready state: Ready - Pattern List
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

$LogFolder = "C:\IR\Exports"
$Patterns = @(
 "EncodedCommand","FromBase64String","DownloadString","Invoke-WebRequest","IEX",
 "Invoke-Expression","certutil","bitsadmin","rundll32","regsvr32",
 "Add-MpPreference","Set-MpPreference","mimikatz","vssadmin","wevtutil cl"
)

Get-ChildItem $LogFolder -Recurse -File |
ForEach-Object {
    $file = $_.FullName
    Select-String -Path $file -Pattern $Patterns -SimpleMatch -ErrorAction SilentlyContinue |
    Select-Object @{n='File';e={$file}}, LineNumber, Pattern, Line
}
