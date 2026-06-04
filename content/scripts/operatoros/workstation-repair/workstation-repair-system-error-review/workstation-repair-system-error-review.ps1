# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: System Error Review

$ErrorActionPreference = 'Stop'

Get-EventLog -LogName System -EntryType Error -Newest 50 | Select-Object TimeGenerated,Source,EventID,Message

