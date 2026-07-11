# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-015
# Title: Repair Network Stack
# Category: Endpoint Remediation
# Ready state: Ready
# Workbook risk: medium
# Body type: CMD

$OperatorOSFrameworkCandidates = @(
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'),
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\..\framework\OperatorOS-ScriptFramework.psm1')
)
$OperatorOSFrameworkPath = $OperatorOSFrameworkCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ($OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

ipconfig /flushdns
netsh winsock reset
netsh int ip reset
ipconfig /registerdns
shutdown /r /t 60 /c "Network stack repair completed. Rebooting to apply reset."
