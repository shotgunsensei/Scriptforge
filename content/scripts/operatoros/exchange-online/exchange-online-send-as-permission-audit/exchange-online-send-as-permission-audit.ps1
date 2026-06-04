param(
  [string]$MailboxIdentity = 'user@example.com'
)

# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Send-As Permission Audit

$ErrorActionPreference = 'Stop'

Get-RecipientPermission -Identity $MailboxIdentity | Select-Object Trustee,AccessRights,IsInherited

