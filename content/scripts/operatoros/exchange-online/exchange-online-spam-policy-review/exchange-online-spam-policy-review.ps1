# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Spam Policy Review

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Get-HostedContentFilterPolicy | Select-Object Name,IsDefault,SpamAction,HighConfidenceSpamAction
