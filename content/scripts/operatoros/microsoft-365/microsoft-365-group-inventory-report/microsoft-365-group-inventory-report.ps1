# OperatorOS ScriptForge official read-only audit script
# Category: Microsoft 365
# Report: Group Inventory Report

$ErrorActionPreference = 'Stop'

Get-MgGroup -All -Property DisplayName,MailEnabled,SecurityEnabled | Select-Object DisplayName,MailEnabled,SecurityEnabled

