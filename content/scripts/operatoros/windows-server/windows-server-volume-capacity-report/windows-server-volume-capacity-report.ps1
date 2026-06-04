# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: Volume Capacity Report

$ErrorActionPreference = 'Stop'

Get-Volume | Select-Object DriveLetter,FileSystemLabel,SizeRemaining,Size

