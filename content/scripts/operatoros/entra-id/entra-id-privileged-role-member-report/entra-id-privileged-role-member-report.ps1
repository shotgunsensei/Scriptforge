# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Privileged Role Member Report

$ErrorActionPreference = 'Stop'

Get-MgDirectoryRole | ForEach-Object { Get-MgDirectoryRoleMember -DirectoryRoleId $_.Id }

