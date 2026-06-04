# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Dynamic Group Audit

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-DynamicDistributionGroup -ResultSize Unlimited | Select-Object DisplayName,RecipientFilter
