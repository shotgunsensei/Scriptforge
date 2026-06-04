# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Computer Inventory Report

$ErrorActionPreference = 'Stop'

Get-ADComputer -Filter * -Properties OperatingSystem,LastLogonDate | Select-Object Name,OperatingSystem,LastLogonDate

