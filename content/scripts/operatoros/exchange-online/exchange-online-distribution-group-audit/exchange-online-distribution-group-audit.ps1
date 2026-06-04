# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Distribution Group Audit

$ErrorActionPreference = 'Stop'

Get-DistributionGroup -ResultSize Unlimited | Select-Object DisplayName,PrimarySmtpAddress,ManagedBy

