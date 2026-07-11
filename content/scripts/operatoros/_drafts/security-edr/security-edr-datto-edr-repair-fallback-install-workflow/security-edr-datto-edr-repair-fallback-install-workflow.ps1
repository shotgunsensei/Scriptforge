# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-004
# Title: Datto EDR Repair / Fallback Install Workflow
# Category: Security / EDR
# Ready state: Ready - Redacted
# Workbook risk: critical
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

# Preferred first action:
# Run Datto RMM component:
#   Datto EDR Maintenance [WIN]

# Verify after maintenance:
Get-Service HUNTAgent -ErrorAction SilentlyContinue |
Format-List Name,DisplayName,Status,StartType

# Fallback only when approved and token is stored securely:
$InstallerUrl = "https://infocyte-support.s3.us-east-2.amazonaws.com/executables/install_huntagent.ps1"
# Fallback download-and-execute removed from default execution. Store installer internally and review before use.
# Install-EDR <TENANT_URL> <INSTALL_TOKEN>

# Manual repair step if required:
# Run as Administrator:
# C:\Program Files\Infocyte\Agent\agent.exe

# shutdown /r /t 0
