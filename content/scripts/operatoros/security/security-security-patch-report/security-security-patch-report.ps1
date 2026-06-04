# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Security Patch Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-CimInstance Win32_QuickFixEngineering | Select-Object HotFixID,InstalledOn,Description
