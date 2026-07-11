# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-005
# Title: Veradigm / Allscripts PM Local Copy Prep
# Category: Healthcare App Deployment
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

$LocalPath = "C:\temp\VeradigmPM"
$InstallerSource = "\\APP-SERVER\SoftwareShare\VeradigmPM\AllScriptsPMClient.msi"
$CertSource = "\\APP-SERVER\SoftwareShare\Certificates\APP-SERVER.example.local.cer"

New-Item -Path $LocalPath -ItemType Directory -Force | Out-Null
Copy-Item $InstallerSource -Destination "$LocalPath\AllScriptsPMClient.msi" -Force
Copy-Item $CertSource -Destination "$LocalPath\APP-SERVER.example.local.cer" -Force
Get-ChildItem $LocalPath
