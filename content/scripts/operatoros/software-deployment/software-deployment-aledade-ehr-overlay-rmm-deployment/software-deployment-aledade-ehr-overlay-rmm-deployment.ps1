# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-001
# Title: Aledade EHR Overlay RMM Deployment
# Category: Software Deployment
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

# REDACTED SKELETON - replace deployment values inside approved internal storage only

$DownloadUrl = '<REDACTED_ALEDADE_DOWNLOAD_URL>'
$LicenseKey  = '<REDACTED_LICENSE_KEY>'
$PracticeId  = '<PRACTICE_ID>'
$InstallScope = 'perMachine'
$WorkDir = Join-Path $env:ProgramData 'Xodus\AledadeOverlay'
$MsiPath = Join-Path $WorkDir 'AledadeAssistEHROverlay.msi'
$MsiLog = 'C:\Users\Public\Downloads\AledadeOverlay-msi-installer.log'
$ChromeForceListPath = 'HKLM:\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist'
$AledadeChromePolicyName = '253'
$AledadeChromePolicyValue = 'pgkopbgbhlmloblcfnlhbffnmcblnhlb;https://clients2.google.com/service/update2/crx'

New-Item -Path $WorkDir -ItemType Directory -Force | Out-Null
Invoke-WebRequest -Uri $DownloadUrl -OutFile $MsiPath -UseBasicParsing -MaximumRedirection 5

$argString = '/i "{0}" /quiet /norestart ALLUSERS=1 INSTALLSCOPE="{1}" LICENSEKEY="{2}" PRACTICEID="{3}" /L*vx! "{4}"' -f $MsiPath, $InstallScope, $LicenseKey, $PracticeId, $MsiLog
$p = Start-Process -FilePath "$env:SystemRoot\System32\msiexec.exe" -ArgumentList $argString -Wait -PassThru -NoNewWindow

New-Item -Path $ChromeForceListPath -Force | Out-Null
New-ItemProperty -Path $ChromeForceListPath -Name $AledadeChromePolicyName -Value $AledadeChromePolicyValue -PropertyType String -Force | Out-Null

exit $p.ExitCode
