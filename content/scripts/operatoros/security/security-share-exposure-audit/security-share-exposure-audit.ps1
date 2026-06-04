# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Share Exposure Audit

$ErrorActionPreference = 'Stop'

Get-SmbShare | Select-Object Name,Path,FolderEnumerationMode

