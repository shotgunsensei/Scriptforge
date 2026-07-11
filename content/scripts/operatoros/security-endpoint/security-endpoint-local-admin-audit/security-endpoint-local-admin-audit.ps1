# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-024
# Title: Local Admin Audit
# Category: Security / Endpoint
# Ready state: Ready
# Workbook risk: low
# Body type: PowerShell / Command Block

$OperatorOSFrameworkCandidates = @(
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'),
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\..\framework\OperatorOS-ScriptFramework.psm1')
)
$OperatorOSFrameworkPath = $OperatorOSFrameworkCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ($OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-LocalGroupMember -Group "Administrators" |
Select-Object Name, ObjectClass, PrincipalSource
