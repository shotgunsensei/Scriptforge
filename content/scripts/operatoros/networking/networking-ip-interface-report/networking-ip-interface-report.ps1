# OperatorOS ScriptForge official read-only audit script
# Category: Networking
# Report: IP Interface Report

$ErrorActionPreference = 'Stop'

Get-NetIPInterface | Select-Object InterfaceAlias,AddressFamily,Dhcp,ConnectionState

