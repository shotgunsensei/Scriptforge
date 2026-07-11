# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-014
# Title: Disable NetBIOS over TCP/IP
# Category: Endpoint Hardening
# Ready state: Ready
# Workbook risk: medium
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

Get-CimInstance -ClassName Win32_NetworkAdapterConfiguration -Filter "IPEnabled = True" |
ForEach-Object {
    $result = Invoke-CimMethod -InputObject $_ -MethodName SetTcpipNetbios -Arguments @{ TcpipNetbiosOptions = 2 }
    [pscustomobject]@{
        Description = $_.Description
        Index = $_.Index
        Result = $result.ReturnValue
    }
}
