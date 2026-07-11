# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-021
# Title: Clean Old User Profiles
# Category: Endpoint Maintenance
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

$DaysOld = 90
$Cutoff = (Get-Date).AddDays(-$DaysOld)

Get-CimInstance Win32_UserProfile |
Where-Object {
    -not $_.Special -and
    $_.LocalPath -like "C:\Users\*" -and
    $_.LastUseTime -lt $Cutoff
} |
Select-Object LocalPath, LastUseTime, SID

# To remove after review:
# Get-CimInstance Win32_UserProfile | Where-Object { <same filters> } | Remove-CimInstance
