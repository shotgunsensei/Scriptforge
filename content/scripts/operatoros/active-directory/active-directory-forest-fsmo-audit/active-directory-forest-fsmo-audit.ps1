# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Forest FSMO Audit

$ErrorActionPreference = 'Stop'

Get-ADForest | Select-Object Name,ForestMode,SchemaMaster,DomainNamingMaster

