# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-007
# Title: MSI Install with Verbose Logging / Repair
# Category: Software Deployment
# Ready state: Ready
# Workbook risk: medium
# Body type: CMD / msiexec

$OperatorOSFrameworkCandidates = @(
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'),
    (Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\..\framework\OperatorOS-ScriptFramework.psm1')
)
$OperatorOSFrameworkPath = $OperatorOSFrameworkCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ($OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

# Interactive install with verbose logging
msiexec /i "C:\temp\VeradigmPM\AllScriptsPMClient.msi" /L*V "C:\temp\VeradigmPM\AllScriptsPMClient_install.log"
# Silent install
msiexec /i "C:\temp\VeradigmPM\AllScriptsPMClient.msi" /qn /norestart /L*V "C:\temp\VeradigmPM\AllScriptsPMClient_install.log"
# Repair if install completed but launch still fails
msiexec /fvamus "C:\temp\VeradigmPM\AllScriptsPMClient.msi" /L*V "C:\temp\VeradigmPM\AllScriptsPMClient_repair.log"
