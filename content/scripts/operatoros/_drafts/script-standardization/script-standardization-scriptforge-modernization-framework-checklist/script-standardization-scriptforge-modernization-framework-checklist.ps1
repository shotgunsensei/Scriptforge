# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-038
# Title: ScriptForge Modernization Framework Checklist
# Category: Script Standardization
# Ready state: Backlog / Framework
# Workbook risk: low
# Body type: Framework Checklist

$OperatorOSFrameworkCandidates = @(
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'),
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\..\framework\OperatorOS-ScriptFramework.psm1')
)
$OperatorOSFrameworkPath = $OperatorOSFrameworkCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ($OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

# Framework adoption checklist:
# 1. Add #Requires -Version 5.1
# 2. Use common Write-Log / New-Result helpers
# 3. Return structured JSON: status, computer, actions, evidence, errors
# 4. Support -WhatIf / -DryRun where risky
# 5. Store logs under C:\ProgramData\Xodus\<ToolName>\
# 6. Map exit codes: 0 success, 1 warning/action needed, 2 failure, 99 unhandled
