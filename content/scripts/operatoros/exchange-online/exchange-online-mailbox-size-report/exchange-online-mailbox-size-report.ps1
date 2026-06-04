# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Mailbox Size Report

$ErrorActionPreference = 'Stop'

Get-EXOMailbox -ResultSize Unlimited | Get-EXOMailboxStatistics | Select-Object DisplayName,TotalItemSize,ItemCount

