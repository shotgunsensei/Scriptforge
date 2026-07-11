# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-027
# Title: Active Directory User Creation Template
# Category: Identity / AD
# Ready state: Needs Review
# Workbook risk: high
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

Import-Module ActiveDirectory

$Sam = "jdoe"
$Name = "John Doe"
$OU = "OU=Users,DC=example,DC=local"
$TempPassword = ConvertTo-SecureString "<TEMP_PASSWORD>" -AsPlainText -Force

# New-ADUser -SamAccountName $Sam -Name $Name -DisplayName $Name -Path $OU `
#     -AccountPassword $TempPassword -Enabled $true -ChangePasswordAtLogon $true

# Add-ADGroupMember -Identity "Domain Users" -Members $Sam
Get-ADUser $Sam -Properties Enabled,PasswordLastSet,MemberOf
