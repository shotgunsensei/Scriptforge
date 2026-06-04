# OperatorOS ScriptForge official read-only audit script
# Category: Kaseya / Datto RMM
# Report: RMM Disk Capacity Snapshot

$ErrorActionPreference = 'Stop'

Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID,FreeSpace,Size

