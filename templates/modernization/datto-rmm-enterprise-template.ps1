[CmdletBinding(SupportsShouldProcess = $true)]
param([string] $ConfigPath, [string] $OutputPath = ".\operatoros-output", [switch] $DryRun)

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath "..\\..\\..\\framework\\OperatorOS-ScriptFramework.psm1"
Import-Module $OperatorOSFrameworkPath -Force

$Context = New-OperatorOSExecutionContext -ScriptName "Datto RMM Enterprise Audit" -SafetyMode Audit -ConfigPath $ConfigPath -DryRun:$DryRun -OutputPath $OutputPath

try {
    $Results = Invoke-OperatorOSOperation -Context $Context -Name "Collect RMM agent baseline" -Operation {
        Get-Service | Where-Object { $_.Name -match "AEM|Datto|CentraStage" } | Select-Object Name,DisplayName,Status,StartType
    }
    Export-OperatorOSReport -Context $Context -Data $Results -Format Json, Csv, Html
    Complete-OperatorOSExecution -Context $Context -FindingCount @($Results | Where-Object { $_.Status -ne "Running" }).Count
} catch {
    Add-OperatorOSException -Context $Context -Exception $_.Exception -Operation "Datto RMM Enterprise Audit"
    throw
}
