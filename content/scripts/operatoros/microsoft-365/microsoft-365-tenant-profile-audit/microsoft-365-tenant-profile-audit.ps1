# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: Tenant Profile Audit

$ErrorActionPreference = 'Stop'

Get-MgOrganization | Select-Object Id,DisplayName,VerifiedDomains

