# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: OU Inventory Report

$ErrorActionPreference = 'Stop'

Get-ADObject -LDAPFilter '(objectClass=organizationalUnit)' -Properties CanonicalName | Select-Object Name,CanonicalName

