# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Certificate Expiration Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-ChildItem Cert:\LocalMachine\My | Select-Object Subject,Issuer,NotAfter,Thumbprint
