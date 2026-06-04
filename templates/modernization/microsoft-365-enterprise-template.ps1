[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string] $ConfigPath,
    [string] $OutputPath = ".\operatoros-output",
    [switch] $DryRun
)

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath "..\\..\\..\\framework\\OperatorOS-ScriptFramework.psm1"
Import-Module $OperatorOSFrameworkPath -Force

$Context = New-OperatorOSExecutionContext -ScriptName "Microsoft 365 Enterprise Audit" -SafetyMode Audit -ConfigPath $ConfigPath -DryRun:$DryRun -OutputPath $OutputPath

try {
    Assert-OperatorOSPowerShellVersion -MinimumVersion "7.0"
    Assert-OperatorOSModuleDependency -ModuleName @("Microsoft.Graph.Authentication", "Microsoft.Graph.Users")
    Assert-OperatorOSPermission -PermissionName "Microsoft Graph read permission" -ValidationScript { Get-MgContext -ErrorAction SilentlyContinue }

    $Results = Invoke-OperatorOSOperation -Context $Context -Name "Collect Microsoft 365 tenant users" -Operation {
        Get-MgUser -All -Property Id,DisplayName,UserPrincipalName,AccountEnabled
    }

    Add-OperatorOSEvidence -Context $Context -Name "UserCount" -Value @($Results).Count
    Export-OperatorOSReport -Context $Context -Data $Results -Format Json, Csv, Html
    Complete-OperatorOSExecution -Context $Context -FindingCount @($Results).Count
} catch {
    Add-OperatorOSException -Context $Context -Exception $_.Exception -Operation "Microsoft 365 Enterprise Audit"
    throw
}
