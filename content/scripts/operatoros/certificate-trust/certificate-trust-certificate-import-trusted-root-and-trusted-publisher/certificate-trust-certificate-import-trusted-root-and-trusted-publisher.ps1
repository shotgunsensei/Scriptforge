# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-006
# Title: Certificate Import - Trusted Root and Trusted Publisher
# Category: Certificate / Trust
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

$CertPath = "C:\temp\VeradigmPM\APP-SERVER.example.local.cer"

certutil -addstore -f "Root" $CertPath
certutil -addstore -f "TrustedPublisher" $CertPath

$CertSubjectSearch = "APP-SERVER"

Write-Host "`n=== Trusted Root ===" -ForegroundColor Cyan
Get-ChildItem Cert:\LocalMachine\Root |
Where-Object { $_.Subject -match $CertSubjectSearch } |
Select-Object Subject, Issuer, NotBefore, NotAfter, Thumbprint

Write-Host "`n=== Trusted Publishers ===" -ForegroundColor Cyan
Get-ChildItem Cert:\LocalMachine\TrustedPublisher |
Where-Object { $_.Subject -match $CertSubjectSearch } |
Select-Object Subject, Issuer, NotBefore, NotAfter, Thumbprint
