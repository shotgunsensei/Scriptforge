# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Spam Policy Review

$ErrorActionPreference = 'Stop'

Get-HostedContentFilterPolicy | Select-Object Name,IsDefault,SpamAction,HighConfidenceSpamAction

