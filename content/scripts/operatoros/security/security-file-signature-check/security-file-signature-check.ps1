
param(
  [string]$FilePath = 'C:\Windows\System32\notepad.exe'
)

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}


# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: File Signature Check

$ErrorActionPreference = 'Stop'

Get-AuthenticodeSignature -FilePath $FilePath | Select-Object Status,SignerCertificate,Path
