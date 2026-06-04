# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: SMB Session Report

$ErrorActionPreference = 'Stop'

Get-SmbSession | Select-Object ClientComputerName,ClientUserName,NumOpens

