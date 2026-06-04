# OperatorOS ScriptForge official read-only audit script
# Category: Entra ID
# Report: Conditional Access Policy Audit

$ErrorActionPreference = 'Stop'

Get-MgIdentityConditionalAccessPolicy | Select-Object DisplayName,State,CreatedDateTime,ModifiedDateTime

