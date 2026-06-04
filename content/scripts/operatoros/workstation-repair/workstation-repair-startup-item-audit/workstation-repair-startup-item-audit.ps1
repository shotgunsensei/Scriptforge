# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: Startup Item Audit

$ErrorActionPreference = 'Stop'

Get-CimInstance Win32_StartupCommand | Select-Object Name,Command,Location,User

