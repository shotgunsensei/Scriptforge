# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Local Administrators Audit

$ErrorActionPreference = 'Stop'

Get-LocalGroupMember -Group Administrators | Select-Object Name,ObjectClass,PrincipalSource

