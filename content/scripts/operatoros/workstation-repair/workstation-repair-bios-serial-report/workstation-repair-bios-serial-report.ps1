# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: BIOS Serial Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-CimInstance Win32_BIOS | Select-Object SerialNumber,SMBIOSBIOSVersion,ReleaseDate
