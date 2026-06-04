# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Domain FSMO Audit

$ErrorActionPreference = 'Stop'

Get-ADDomain | Select-Object DNSRoot,DomainMode,PDCEmulator,RIDMaster,InfrastructureMaster

