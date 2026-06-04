# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Locked Account Report

$ErrorActionPreference = 'Stop'

Search-ADAccount -LockedOut | Select-Object Name,SamAccountName,LockedOut

