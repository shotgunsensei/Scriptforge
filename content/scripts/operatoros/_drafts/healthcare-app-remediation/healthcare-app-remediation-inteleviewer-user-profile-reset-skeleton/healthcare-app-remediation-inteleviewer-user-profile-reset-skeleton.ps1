# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-035
# Title: InteleViewer User Profile Reset Skeleton
# Category: Healthcare App Remediation
# Ready state: Needs Validation
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

$UserProfile = "C:\Users\<USERNAME>"
$Backup = "C:\Temp\InteleViewerProfileBackup_<USERNAME>"

New-Item -Path $Backup -ItemType Directory -Force | Out-Null

$CandidatePaths = @(
    "$UserProfile\AppData\Roaming\Intelerad",
    "$UserProfile\AppData\Local\Intelerad",
    "$UserProfile\AppData\Roaming\InteleViewer",
    "$UserProfile\AppData\Local\InteleViewer"
)

foreach ($Path in $CandidatePaths) {
    if (Test-Path $Path) {
        Copy-Item $Path -Destination $Backup -Recurse -Force -ErrorAction SilentlyContinue
        Rename-Item $Path "$Path.old" -ErrorAction SilentlyContinue
    }
}
