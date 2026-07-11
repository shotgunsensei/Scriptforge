# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-018
# Title: Restart Service Verified
# Category: Endpoint Remediation
# Ready state: Ready
# Workbook risk: medium
# Body type: PowerShell / Command Block

pa

$OperatorOSFrameworkCandidates = @(
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'),
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\..\framework\OperatorOS-ScriptFramework.psm1')
)
$OperatorOSFrameworkPath = $OperatorOSFrameworkCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ($OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

ram(
    [Parameter(Mandatory=$true)]
    [string]$ServiceName
)

$svc = Get-Service -Name $ServiceName -ErrorAction Stop

if ($svc.Status -eq 'Running') {
    Restart-Service -Name $ServiceName -Force -ErrorAction Stop
} else {
    Start-Service -Name $ServiceName -ErrorAction Stop
}

Start-Sleep -Seconds 10

Get-Service -Name $ServiceName |
Select-Object Name,DisplayName,Status,StartType
