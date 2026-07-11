# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-036
# Title: Unexpected Shutdown / Display Layout Evidence Collector
# Category: Diagnostics / Evidence
# Ready state: Ready
# Workbook risk: low
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

$DaysBack = 14
$Since = (Get-Date).AddDays(-$DaysBack)
$Out = "C:\Temp\Shutdown_Display_Diag_$env:COMPUTERNAME"
New-Item -Path $Out -ItemType Directory -Force | Out-Null

$Filters = @(
    @{LogName='System'; Id=41,1074,6005,6006,6008,109,1; StartTime=$Since},
    @{LogName='Application'; StartTime=$Since}
)

Get-WinEvent -FilterHashtable $Filters[0] -ErrorAction SilentlyContinue |
Export-Csv "$Out\System_Power_Shutdown.csv" -NoTypeInformation

Get-WinEvent -FilterHashtable @{LogName='System'; ProviderName='Display'; StartTime=$Since} -ErrorAction SilentlyContinue |
Export-Csv "$Out\Display_Events.csv" -NoTypeInformation

powercfg /lastwake > "$Out\powercfg_lastwake.txt"
powercfg /waketimers > "$Out\powercfg_waketimers.txt"
powercfg /requests > "$Out\powercfg_requests.txt"

Compress-Archive -Path $Out -DestinationPath "$Out.zip" -Force
