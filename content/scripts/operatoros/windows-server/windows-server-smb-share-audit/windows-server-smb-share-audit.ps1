# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: SMB Share Audit

$ErrorActionPreference = 'Stop'

Get-SmbShare | Select-Object Name,Path,Description,FolderEnumerationMode

