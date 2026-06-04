# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: SMB Share Audit

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-SmbShare | Select-Object Name,Path,Description,FolderEnumerationMode
