# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Directory Audit Log Export

$ErrorActionPreference = 'Stop'

Get-MgAuditLogDirectoryAudit -Top 50 | Select-Object ActivityDateTime,ActivityDisplayName,Result

