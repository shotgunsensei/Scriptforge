# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-037
# Title: ActiveFax Server Target Discovery / Config Notes
# Category: Fax / Printing
# Ready state: Needs Validation
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

# Discovery helper - version/location may vary
$SearchRoots = @(
    "C:\ProgramData",
    "C:\Program Files",
    "C:\Program Files (x86)",
    "$env:APPDATA",
    "$env:LOCALAPPDATA"
)

foreach ($Root in $SearchRoots) {
    if (Test-Path $Root) {
        Get-ChildItem $Root -Recurse -ErrorAction SilentlyContinue -File |
        Where-Object { $_.Name -match "activefax|actfax|fax" -and $_.Extension -match "\.ini|\.cfg|\.xml|\.txt" } |
        Select-Object FullName, Length, LastWriteTime
    }
}

reg query HKLM /f ActiveFax /s
reg query HKCU /f ActiveFax /s
