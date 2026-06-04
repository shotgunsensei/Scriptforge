# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Dynamic Group Audit

$ErrorActionPreference = 'Stop'

Get-DynamicDistributionGroup -ResultSize Unlimited | Select-Object DisplayName,RecipientFilter

