# OperatorOS ScriptForge official read-only audit script
# Category: Windows Server
# Report: Installed Role Audit

$ErrorActionPreference = 'Stop'

Get-WindowsFeature | Where-Object Installed | Select-Object Name,DisplayName,InstallState

