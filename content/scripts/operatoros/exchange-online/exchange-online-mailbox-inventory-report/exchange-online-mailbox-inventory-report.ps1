# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Mailbox Inventory Report

$ErrorActionPreference = 'Stop'

Get-EXOMailbox -ResultSize Unlimited | Select-Object DisplayName,UserPrincipalName,RecipientTypeDetails

