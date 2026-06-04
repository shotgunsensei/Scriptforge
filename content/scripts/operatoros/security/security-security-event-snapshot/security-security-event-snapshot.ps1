# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Security Event Snapshot

$ErrorActionPreference = 'Stop'

Get-EventLog -LogName Security -Newest 100 | Select-Object TimeGenerated,EntryType,Source,EventID,Message

