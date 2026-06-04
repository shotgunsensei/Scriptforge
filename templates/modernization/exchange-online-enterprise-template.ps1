[CmdletBinding(SupportsShouldProcess = $true)]
param([string] $ConfigPath, [string] $OutputPath = ".\operatoros-output", [switch] $DryRun)

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath "..\\..\\..\\framework\\OperatorOS-ScriptFramework.psm1"
Import-Module $OperatorOSFrameworkPath -Force

$Context = New-OperatorOSExecutionContext -ScriptName "Exchange Online Enterprise Audit" -SafetyMode Audit -ConfigPath $ConfigPath -DryRun:$DryRun -OutputPath $OutputPath

try {
    Assert-OperatorOSModuleDependency -ModuleName @("ExchangeOnlineManagement")
    $Results = Invoke-OperatorOSOperation -Context $Context -Name "Collect mailbox forwarding state" -Operation {
        Get-Mailbox -ResultSize Unlimited | Select-Object DisplayName,PrimarySmtpAddress,ForwardingAddress,ForwardingSmtpAddress,DeliverToMailboxAndForward
    }
    Export-OperatorOSReport -Context $Context -Data $Results -Format Json, Csv, Html
    Complete-OperatorOSExecution -Context $Context -FindingCount @($Results | Where-Object { $_.ForwardingAddress -or $_.ForwardingSmtpAddress }).Count
} catch {
    Add-OperatorOSException -Context $Context -Exception $_.Exception -Operation "Exchange Online Enterprise Audit"
    throw
}
