# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Group Membership Export

$ErrorActionPreference = 'Stop'

Get-ADGroupMember -Identity $GroupName -Recursive | Select-Object Name,SamAccountName,ObjectClass

