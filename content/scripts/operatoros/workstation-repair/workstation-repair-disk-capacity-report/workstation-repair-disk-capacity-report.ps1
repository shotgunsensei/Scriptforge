# OperatorOS ScriptForge official read-only audit script
# Category: Workstation Repair
# Report: Disk Capacity Report

$ErrorActionPreference = 'Stop'

Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID,DriveType,FreeSpace,Size

