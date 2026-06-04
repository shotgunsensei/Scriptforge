# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Group Inventory Report

$ErrorActionPreference = 'Stop'

Get-ADGroup -Filter * -Properties GroupCategory,GroupScope | Select-Object Name,GroupCategory,GroupScope

