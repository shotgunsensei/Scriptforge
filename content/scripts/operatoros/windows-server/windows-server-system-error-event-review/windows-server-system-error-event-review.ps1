# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: System Error Event Review

$ErrorActionPreference = 'Stop'

Get-EventLog -LogName System -EntryType Error -Newest 100 | Select-Object TimeGenerated,Source,EventID,Message

