[CmdletBinding(SupportsShouldProcess = $true)]
param([string] $ConfigPath, [string] $OutputPath = ".\operatoros-output", [switch] $DryRun)

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath "..\\..\\..\\framework\\OperatorOS-ScriptFramework.psm1"
Import-Module $OperatorOSFrameworkPath -Force

$Context = New-OperatorOSExecutionContext -ScriptName "Active Directory Enterprise Audit" -SafetyMode Audit -ConfigPath $ConfigPath -DryRun:$DryRun -OutputPath $OutputPath

try {
    Assert-OperatorOSModuleDependency -ModuleName @("ActiveDirectory")
    $Results = Invoke-OperatorOSOperation -Context $Context -Name "Collect inactive AD users" -Operation {
        Search-ADAccount -UsersOnly -AccountInactive -TimeSpan 90.00:00:00 | Select-Object Name,SamAccountName,Enabled,LastLogonDate
    }
    Export-OperatorOSReport -Context $Context -Data $Results -Format Json, Csv, Html
    Complete-OperatorOSExecution -Context $Context -FindingCount @($Results).Count
} catch {
    Add-OperatorOSException -Context $Context -Exception $_.Exception -Operation "Active Directory Enterprise Audit"
    throw
}
