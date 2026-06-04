# OperatorOS ScriptForge official read-only audit script
# Category: Exchange Online
# Report: Organization Config Audit

$ErrorActionPreference = 'Stop'

Get-OrganizationConfig | Select-Object Name,OAuth2ClientProfileEnabled,ModernAuthEnabled

