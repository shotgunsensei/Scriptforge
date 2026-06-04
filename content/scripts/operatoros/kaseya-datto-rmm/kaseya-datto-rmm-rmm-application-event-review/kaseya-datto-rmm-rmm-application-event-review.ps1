# OperatorOS ScriptForge official read-only audit script
# Category: Kaseya / Datto RMM
# Report: RMM Application Event Review

$ErrorActionPreference = 'Stop'

Get-EventLog -LogName Application -Newest 100 | Where-Object Source -match 'Kaseya|Datto|RMM' | Select-Object TimeGenerated,Source,EventID,Message

