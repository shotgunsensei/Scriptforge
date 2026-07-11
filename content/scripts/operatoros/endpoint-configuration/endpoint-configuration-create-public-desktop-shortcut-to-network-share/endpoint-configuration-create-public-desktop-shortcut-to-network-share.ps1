# OperatorOS ScriptForge imported Xodus library script
# Workbook ref: SCR-013
# Title: Create Public Desktop Shortcut to Network Share
# Category: Endpoint Configuration
# Ready state: Ready
# Workbook risk: low
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

$ShortcutName = "Shared Folder.lnk"
$TargetPath = "\\server\share"
$PublicDesktop = [Environment]::GetFolderPath("CommonDesktopDirectory")
$ShortcutPath = Join-Path $PublicDesktop $ShortcutName

$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.Description = "Shared folder shortcut"
$Shortcut.Save()

Get-Item $ShortcutPath
