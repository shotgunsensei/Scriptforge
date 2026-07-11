# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-012
# Title: RMM Download ZIP to Public Desktop, Extract, Delete ZIP
# Category: Software Deployment
# Ready state: Ready - URL Placeholder
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

$DownloadUrl = "<DIRECT_ZIP_DOWNLOAD_URL>"
$PublicDesktop = [Environment]::GetFolderPath("CommonDesktopDirectory")
$WorkDir = Join-Path $env:ProgramData "Xodus\RMMDownloads"
$ZipPath = Join-Path $WorkDir "Payload.zip"
$ExtractPath = Join-Path $PublicDesktop "Payload"

New-Item -Path $WorkDir -ItemType Directory -Force | Out-Null
if (Test-Path $ExtractPath) { Remove-Item $ExtractPath -Recurse -Force -ErrorAction SilentlyContinue }

Invoke-WebRequest -Uri $DownloadUrl -OutFile $ZipPath -UseBasicParsing
Expand-Archive -Path $ZipPath -DestinationPath $ExtractPath -Force
Remove-Item $ZipPath -Force

Get-ChildItem $ExtractPath
