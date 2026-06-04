param(
  [string]$MailboxIdentity = 'user@example.com'
)

# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Mailbox Permission Audit

$ErrorActionPreference = 'Stop'

Get-MailboxPermission -Identity $MailboxIdentity | Select-Object User,AccessRights,Deny,IsInherited

