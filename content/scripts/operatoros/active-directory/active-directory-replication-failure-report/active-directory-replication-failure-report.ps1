# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Replication Failure Report

$ErrorActionPreference = 'Stop'

Get-ADReplicationFailure -Scope Forest | Select-Object Server,Partner,FailureCount,LastError

