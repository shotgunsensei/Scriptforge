param(
  [string]$MailboxIdentity = 'user@example.com'
)

# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Inbox Rule Forwarding Audit

$ErrorActionPreference = 'Stop'

Get-InboxRule -Mailbox $MailboxIdentity | Select-Object Name,Enabled,ForwardTo,RedirectTo,DeleteMessage

