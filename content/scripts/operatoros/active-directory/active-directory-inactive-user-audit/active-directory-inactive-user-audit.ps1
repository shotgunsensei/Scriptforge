# OperatorOS ScriptForge official read-only audit script
# Category: Active Directory
# Report: Inactive User Audit

$OperatorOSFrameworkPath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\..\framework\OperatorOS-ScriptFramework.psm1'
if (Test-Path -LiteralPath $OperatorOSFrameworkPath) {
    Import-Module $OperatorOSFrameworkPath -Force
}

$ErrorActionPreference = 'Stop'

Search-ADAccount -AccountInactive -UsersOnly -TimeSpan 90.00:00:00 | Select-Object Name,SamAccountName,LastLogonDate
