# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Password Policy Audit

$ErrorActionPreference = 'Stop'

Get-ADDefaultDomainPasswordPolicy | Select-Object ComplexityEnabled,MinPasswordLength,MaxPasswordAge,LockoutThreshold

