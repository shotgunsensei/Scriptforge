[CmdletBinding(SupportsShouldProcess = $true)]
param([string] $ConfigPath, [string] $OutputPath = ".\operatoros-output", [switch] $DryRun)

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath "..\\..\\..\\framework\\OperatorOS-ScriptFramework.psm1"
Import-Module $OperatorOSFrameworkPath -Force

$Context = New-OperatorOSExecutionContext -ScriptName "Entra ID Enterprise Audit" -SafetyMode Audit -ConfigPath $ConfigPath -DryRun:$DryRun -OutputPath $OutputPath

try {
    Assert-OperatorOSModuleDependency -ModuleName @("Microsoft.Graph.Authentication", "Microsoft.Graph.Identity.SignIns")
    $Results = Invoke-OperatorOSOperation -Context $Context -Name "Collect conditional access policies" -Operation {
        Get-MgIdentityConditionalAccessPolicy -All | Select-Object Id,DisplayName,State,CreatedDateTime,ModifiedDateTime
    }
    Export-OperatorOSReport -Context $Context -Data $Results -Format Json, Csv, Html
    Complete-OperatorOSExecution -Context $Context -FindingCount @($Results).Count
} catch {
    Add-OperatorOSException -Context $Context -Exception $_.Exception -Operation "Entra ID Enterprise Audit"
    throw
}
