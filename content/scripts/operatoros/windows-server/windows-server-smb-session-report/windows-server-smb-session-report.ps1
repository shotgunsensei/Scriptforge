# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: SMB Session Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-SmbSession | Select-Object ClientComputerName,ClientUserName,NumOpens
