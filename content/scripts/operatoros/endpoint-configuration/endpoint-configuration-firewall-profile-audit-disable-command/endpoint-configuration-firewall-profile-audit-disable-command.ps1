# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-034
# Title: Firewall Profile Audit / Disable Command
# Category: Endpoint Configuration
# Ready state: Ready
# Workbook risk: high
# Body type: PowerShell / Command Block

$OperatorOSFrameworkCandidates = @(
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'),
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\..\framework\OperatorOS-ScriptFramework.psm1')
)
$OperatorOSFrameworkPath = $OperatorOSFrameworkCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ($OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

gpresult /h C:\gpresult.html

Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction,DefaultOutboundAction

# Only when explicitly approved:
# Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False

# Policy path to check:
# HKLM\SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile
