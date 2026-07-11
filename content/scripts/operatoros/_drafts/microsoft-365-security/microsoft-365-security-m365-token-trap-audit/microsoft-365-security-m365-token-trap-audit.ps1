# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-028
# Title: M365 Token Trap Audit
# Category: Microsoft 365 / Security
# Ready state: Backlog / Design
# Workbook risk: high
# Body type: Design Stub

$OperatorOSFrameworkCandidates = @(
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'),
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\..\framework\OperatorOS-ScriptFramework.psm1')
)
$OperatorOSFrameworkPath = $OperatorOSFrameworkCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ($OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

# Planned structure
# Connect-MgGraph -Scopes "Directory.Read.All","AuditLog.Read.All","Policy.Read.All"
# Connect-ExchangeOnline
# 1. Audit app consent and service principals
# 2. Check legacy auth / CA controls / risky user settings
# 3. Report inbox rules and forwarding
# 4. Report inactive privileged users
# 5. Export HTML/CSV technician report
