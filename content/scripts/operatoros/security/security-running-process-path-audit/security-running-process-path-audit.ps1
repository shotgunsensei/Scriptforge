# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Running Process Path Audit

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-Process | Where-Object Path | Select-Object Name,Id,Path,Company
