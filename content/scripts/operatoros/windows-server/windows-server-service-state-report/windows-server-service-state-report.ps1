# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: Service State Report

$ErrorActionPreference = 'Stop'

Get-Service | Select-Object Name,DisplayName,Status,StartType

