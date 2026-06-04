# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Security Patch Report

$ErrorActionPreference = 'Stop'

Get-CimInstance Win32_QuickFixEngineering | Select-Object HotFixID,InstalledOn,Description

