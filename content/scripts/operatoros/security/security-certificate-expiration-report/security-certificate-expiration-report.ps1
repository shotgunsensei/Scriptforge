# OperatorOS ScriptForge official read-only audit script
# Category: Security
# Report: Certificate Expiration Report

$ErrorActionPreference = 'Stop'

Get-ChildItem Cert:\LocalMachine\My | Select-Object Subject,Issuer,NotAfter,Thumbprint

