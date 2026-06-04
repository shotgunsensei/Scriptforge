# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: Application Error Event Review

$ErrorActionPreference = 'Stop'

Get-EventLog -LogName Application -EntryType Error -Newest 100 | Select-Object TimeGenerated,Source,EventID,Message

