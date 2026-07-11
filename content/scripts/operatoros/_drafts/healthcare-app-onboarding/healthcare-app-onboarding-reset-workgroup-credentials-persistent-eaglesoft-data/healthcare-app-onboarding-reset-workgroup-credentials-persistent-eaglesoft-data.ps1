# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-010
# Title: Reset Workgroup Credentials + Persistent Eaglesoft DATA Drive
# Category: Healthcare App Onboarding
# Ready state: Ready - Redacted
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

$Server = "example-workstation"
$Share = "\\example-workstation\DATA"
$DriveLetter = "Z:"
$User = "example-workstation\Team"
$Password = "<REDACTED_USE_SECURE_RMM_VARIABLE>"

cmdkey /delete:$Server 2>$null
net use $DriveLetter /delete /y 2>$null

cmdkey /add:$Server /user:$User /pass:$Password
net use $DriveLetter $Share /user:$User $Password /persistent:yes

net use $DriveLetter
