# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: Uptime Report

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,LastBootUpTime
