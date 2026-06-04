param(
  [string]$DnsName = 'example.com'
)

# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: DNS Resolution Test

$ErrorActionPreference = 'Stop'

Resolve-DnsName -Name $DnsName | Select-Object Name,Type,IPAddress,NameHost

