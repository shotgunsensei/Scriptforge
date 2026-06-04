# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Quarantine Summary

$ErrorActionPreference = 'Stop'

Get-QuarantineMessage -PageSize 100 | Select-Object ReceivedTime,SenderAddress,Subject,Type

