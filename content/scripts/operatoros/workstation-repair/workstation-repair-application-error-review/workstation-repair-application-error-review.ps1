# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: Application Error Review

$ErrorActionPreference = 'Stop'

Get-EventLog -LogName Application -EntryType Error -Newest 50 | Select-Object TimeGenerated,Source,EventID,Message

