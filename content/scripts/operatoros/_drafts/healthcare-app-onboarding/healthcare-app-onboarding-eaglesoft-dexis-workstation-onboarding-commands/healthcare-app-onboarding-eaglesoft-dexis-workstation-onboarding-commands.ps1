# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-011
# Title: Eaglesoft / Dexis Workstation Onboarding Commands
# Category: Healthcare App Onboarding
# Ready state: Needs Site Validation
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

# Site-specific onboarding template - verify server IP/name before use
$EaglesoftServer = "example-workstation"
$DexisServer = "example-imaging-server"
$EaglesoftShare = "\\example-workstation\DATA"
$DexisShare = "\\example-imaging-server\Dexis"
$LocalUser = "Team"
$LocalPassword = "<REDACTED_USE_SECURE_VARIABLE>"

# Optional local account creation
net user $LocalUser $LocalPassword /add
net localgroup Administrators $LocalUser /add

# Map shares
net use Z: $EaglesoftShare /persistent:yes
net use Y: $DexisShare /persistent:yes

# Launch installer after validating exact path
Start-Process "\\example-workstation\DATA\Eaglesoft\ESInstall\Launcher\ESSilentInstall" -Wait
