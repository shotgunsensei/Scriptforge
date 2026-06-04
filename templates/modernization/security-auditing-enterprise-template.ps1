[CmdletBinding(SupportsShouldProcess = $true)]
param([string] $ConfigPath, [string] $OutputPath = ".\operatoros-output", [switch] $DryRun)

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath "..\\..\\..\\framework\\OperatorOS-ScriptFramework.psm1"
Import-Module $OperatorOSFrameworkPath -Force

$Context = New-OperatorOSExecutionContext -ScriptName "Security Auditing Enterprise Baseline" -SafetyMode Audit -ConfigPath $ConfigPath -DryRun:$DryRun -OutputPath $OutputPath

try {
    $Results = Invoke-OperatorOSOperation -Context $Context -Name "Collect local administrator membership" -Operation {
        Get-LocalGroupMember -Group "Administrators" | Select-Object Name,ObjectClass,PrincipalSource
    }
    Export-OperatorOSReport -Context $Context -Data $Results -Format Json, Csv, Html
    Complete-OperatorOSExecution -Context $Context -FindingCount @($Results).Count -RequiresAdmin:$true
} catch {
    Add-OperatorOSException -Context $Context -Exception $_.Exception -Operation "Security Auditing Enterprise Baseline"
    throw
}
