# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: Domain Verification Audit

$ErrorActionPreference = 'Stop'

Get-MgDomain | Select-Object Id,IsVerified,AuthenticationType

