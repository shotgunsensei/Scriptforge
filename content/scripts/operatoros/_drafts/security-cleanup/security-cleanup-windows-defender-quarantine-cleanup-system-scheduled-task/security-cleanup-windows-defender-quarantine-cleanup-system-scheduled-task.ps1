# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-009
# Title: Windows Defender Quarantine Cleanup - SYSTEM Scheduled Task
# Category: Security / Cleanup
# Ready state: Needs Review
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

# High-risk cleanup template. Run native Defender cleanup first where possible.
$QuarantinePath = "C:\ProgramData\Microsoft\Windows Defender\Quarantine"
$TaskName = "Xodus-DefenderQuarantineCleanup"
$ScriptPath = "$env:ProgramData\Xodus\Cleanup-DefenderQuarantine.ps1"

New-Item -Path (Split-Path $ScriptPath) -ItemType Directory -Force | Out-Null

@'

$Path = "C:\ProgramData\Microsoft\Windows Defender\Quarantine"
if (Test-Path $Path) {
    Get-ChildItem -Path $Path -Force -Recurse -ErrorAction SilentlyContinue |
        Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
}
'@ | Set-Content -Path $ScriptPath -Encoding UTF8

$Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$ScriptPath`""
$Trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1)
$Principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -RunLevel Highest

Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Principal $Principal -Force | Out-Null
Start-ScheduledTask -TaskName $TaskName

Start-Sleep -Seconds 20
Get-ScheduledTask -TaskName $TaskName | Get-ScheduledTaskInfo
