
param(
  [string]$MailboxIdentity = 'user@example.com'
)

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}


# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Send-As Permission Audit

$ErrorActionPreference = 'Stop'

Get-RecipientPermission -Identity $MailboxIdentity | Select-Object Trustee,AccessRights,IsInherited
