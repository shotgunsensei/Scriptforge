# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: User Inventory Report

$ErrorActionPreference = 'Stop'

Get-ADUser -Filter * -Properties Enabled,LastLogonDate | Select-Object Name,SamAccountName,Enabled,LastLogonDate

