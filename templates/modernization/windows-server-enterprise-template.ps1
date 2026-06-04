[CmdletBinding(SupportsShouldProcess = $true)]
param([string] $ConfigPath, [string] $OutputPath = ".\operatoros-output", [switch] $DryRun)

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath "..\\..\\..\\framework\\OperatorOS-ScriptFramework.psm1"
Import-Module $OperatorOSFrameworkPath -Force

$Context = New-OperatorOSExecutionContext -ScriptName "Windows Server Enterprise Audit" -SafetyMode Audit -ConfigPath $ConfigPath -DryRun:$DryRun -OutputPath $OutputPath

try {
    $Results = Invoke-OperatorOSOperation -Context $Context -Name "Collect server volume capacity" -Operation {
        Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | Select-Object DeviceID,Size,FreeSpace,VolumeName
    }
    Export-OperatorOSReport -Context $Context -Data $Results -Format Json, Csv, Html
    Complete-OperatorOSExecution -Context $Context -FindingCount @($Results | Where-Object { $_.FreeSpace / $_.Size -lt 0.15 }).Count
} catch {
    Add-OperatorOSException -Context $Context -Exception $_.Exception -Operation "Windows Server Enterprise Audit"
    throw
}
