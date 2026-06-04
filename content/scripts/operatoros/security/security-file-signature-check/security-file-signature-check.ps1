param(
  [string]$FilePath = 'C:\Windows\System32\notepad.exe'
)

# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: File Signature Check

$ErrorActionPreference = 'Stop'

Get-AuthenticodeSignature -FilePath $FilePath | Select-Object Status,SignerCertificate,Path

