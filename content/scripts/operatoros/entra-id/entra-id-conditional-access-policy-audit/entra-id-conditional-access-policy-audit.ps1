# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Conditional Access Policy Audit

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-MgIdentityConditionalAccessPolicy | Select-Object DisplayName,State,CreatedDateTime,ModifiedDateTime
