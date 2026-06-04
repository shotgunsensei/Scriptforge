# OperatorOS ScriptForge Enterprise Script Framework
# Shared helpers for official OperatorOS automation scripts.

Set-StrictMode -Version Latest

function New-OperatorOSExecutionContext {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string] $ScriptName,

        [ValidateSet('ReadOnly', 'Audit', 'Remediation', 'Emergency')]
        [string] $SafetyMode = 'ReadOnly',

        [string] $ConfigPath,

        [hashtable] $ParameterOverrides = @{},

        [switch] $DryRun,

        [switch] $EnableTranscript,

        [string] $OutputPath = (Join-Path -Path (Get-Location) -ChildPath 'operatoros-output')
    )

    $startedAt = Get-Date
    $context = [ordered]@{
        ScriptName = $ScriptName
        SafetyMode = $SafetyMode
        ConfigPath = $ConfigPath
        Configuration = @{}
        ParameterOverrides = $ParameterOverrides
        DryRun = [bool]$DryRun
        OutputPath = $OutputPath
        StartedAt = $startedAt
        CompletedAt = $null
        DurationSeconds = $null
        Logs = New-Object System.Collections.Generic.List[object]
        Exceptions = New-Object System.Collections.Generic.List[object]
        Evidence = New-Object System.Collections.Generic.List[object]
        RollbackActions = New-Object System.Collections.Generic.List[scriptblock]
        RiskScore = 0
        HealthScore = 100
        Tenant = Get-OperatorOSTenantInfo
        Machine = Get-OperatorOSMachineInfo
        TranscriptPath = $null
    }

    if ($ConfigPath) {
        $context.Configuration = Import-OperatorOSConfig -Path $ConfigPath -ParameterOverrides $ParameterOverrides
    }

    if ($EnableTranscript) {
        Start-OperatorOSTranscript -Context $context | Out-Null
    }

    Write-OperatorOSLog -Context $context -Level Info -Message "Started $ScriptName in $SafetyMode mode."
    return $context
}

function Import-OperatorOSConfig {
    [CmdletBinding()]
    param(
        [string] $Path,
        [hashtable] $ParameterOverrides = @{}
    )

    $config = @{}

    if ($Path) {
        if (-not (Test-Path -LiteralPath $Path)) {
            throw "Configuration file not found: $Path"
        }

        $json = Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json
        foreach ($property in $json.PSObject.Properties) {
            $config[$property.Name] = $property.Value
        }
    }

    foreach ($entry in Get-ChildItem Env:OPERATOROS_* -ErrorAction SilentlyContinue) {
        $key = $entry.Name.Replace('OPERATOROS_', '').ToLowerInvariant()
        $config[$key] = $entry.Value
    }

    foreach ($key in $ParameterOverrides.Keys) {
        $config[$key] = $ParameterOverrides[$key]
    }

    return $config
}

function Write-OperatorOSLog {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [hashtable] $Context,

        [ValidateSet('Info', 'Warning', 'Error', 'Debug', 'Verbose')]
        [string] $Level = 'Info',

        [Parameter(Mandatory = $true)]
        [string] $Message,

        [object] $Data
    )

    $entry = [pscustomobject]@{
        timestamp = (Get-Date).ToString('o')
        level = $Level
        message = $Message
        data = $Data
    }

    $Context.Logs.Add($entry)

    switch ($Level) {
        'Warning' { Write-Warning $Message }
        'Error' { Write-Error $Message }
        'Debug' { Write-Debug $Message }
        'Verbose' { Write-Verbose $Message }
        default { Write-Information $Message -InformationAction Continue }
    }
}

function Start-OperatorOSTranscript {
    [CmdletBinding()]
    param([Parameter(Mandatory = $true)][hashtable] $Context)

    New-Item -ItemType Directory -Path $Context.OutputPath -Force | Out-Null
    $safeName = $Context.ScriptName -replace '[^a-zA-Z0-9\.-]', '-'
    $path = Join-Path -Path $Context.OutputPath -ChildPath "$safeName-transcript.log"
    Start-Transcript -Path $path -Force | Out-Null
    $Context.TranscriptPath = $path
    return $path
}

function Stop-OperatorOSTranscript {
    [CmdletBinding()]
    param([Parameter(Mandatory = $true)][hashtable] $Context)

    if ($Context.TranscriptPath) {
        Stop-Transcript | Out-Null
    }
}

function Assert-OperatorOSPowerShellVersion {
    [CmdletBinding()]
    param(
        [Version] $MinimumVersion = [Version]'5.1'
    )

    if ($PSVersionTable.PSVersion -lt $MinimumVersion) {
        throw "PowerShell $MinimumVersion or newer is required. Current version: $($PSVersionTable.PSVersion)."
    }
}

function Assert-OperatorOSModuleDependency {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string[]] $ModuleName
    )

    foreach ($module in $ModuleName) {
        if (-not (Get-Module -ListAvailable -Name $module)) {
            throw "Required PowerShell module is missing: $module"
        }
    }
}

function Assert-OperatorOSPermission {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string] $PermissionName,

        [scriptblock] $ValidationScript
    )

    if ($ValidationScript -and -not (& $ValidationScript)) {
        throw "Required permission validation failed: $PermissionName"
    }
}

function Register-OperatorOSRollbackAction {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [hashtable] $Context,

        [Parameter(Mandatory = $true)]
        [scriptblock] $Action
    )

    $Context.RollbackActions.Add($Action)
}

function Invoke-OperatorOSRollback {
    [CmdletBinding()]
    param([Parameter(Mandatory = $true)][hashtable] $Context)

    for ($index = $Context.RollbackActions.Count - 1; $index -ge 0; $index--) {
        try {
            & $Context.RollbackActions[$index]
        } catch {
            Add-OperatorOSException -Context $Context -Exception $_.Exception -Operation 'Rollback'
        }
    }
}

function Invoke-OperatorOSOperation {
    [CmdletBinding(SupportsShouldProcess = $true)]
    param(
        [Parameter(Mandatory = $true)]
        [hashtable] $Context,

        [Parameter(Mandatory = $true)]
        [string] $Name,

        [Parameter(Mandatory = $true)]
        [scriptblock] $Operation,

        [scriptblock] $Rollback
    )

    if ($Rollback) {
        Register-OperatorOSRollbackAction -Context $Context -Action $Rollback
    }

    if ($Context.DryRun) {
        Write-OperatorOSLog -Context $Context -Level Info -Message "Dry run skipped operation: $Name"
        return $null
    }

    if ($PSCmdlet.ShouldProcess($Name, 'Run OperatorOS operation')) {
        try {
            Write-OperatorOSLog -Context $Context -Level Info -Message "Running operation: $Name"
            return & $Operation
        } catch {
            Add-OperatorOSException -Context $Context -Exception $_.Exception -Operation $Name
            throw
        }
    }
}

function Add-OperatorOSException {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [hashtable] $Context,

        [Parameter(Mandatory = $true)]
        [Exception] $Exception,

        [string] $Operation
    )

    $Context.Exceptions.Add([pscustomobject]@{
        timestamp = (Get-Date).ToString('o')
        operation = $Operation
        message = $Exception.Message
        type = $Exception.GetType().FullName
    })

    $Context.HealthScore = [Math]::Max(0, $Context.HealthScore - 15)
}

function Add-OperatorOSEvidence {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [hashtable] $Context,

        [Parameter(Mandatory = $true)]
        [string] $Name,

        [Parameter(Mandatory = $true)]
        [object] $Value
    )

    $Context.Evidence.Add([pscustomobject]@{
        timestamp = (Get-Date).ToString('o')
        name = $Name
        value = $Value
    })
}

function Get-OperatorOSRiskScore {
    [CmdletBinding()]
    param(
        [ValidateSet('ReadOnly', 'Audit', 'Remediation', 'Emergency')]
        [string] $SafetyMode,

        [int] $FindingCount = 0,

        [bool] $RequiresAdmin = $false
    )

    $base = switch ($SafetyMode) {
        'ReadOnly' { 10 }
        'Audit' { 20 }
        'Remediation' { 55 }
        'Emergency' { 80 }
    }

    if ($RequiresAdmin) { $base += 10 }
    $base += [Math]::Min(20, $FindingCount * 2)
    return [Math]::Min(100, $base)
}

function Get-OperatorOSHealthScore {
    [CmdletBinding()]
    param(
        [int] $ExceptionCount = 0,
        [int] $WarningCount = 0,
        [int] $FindingCount = 0
    )

    $score = 100 - ($ExceptionCount * 15) - ($WarningCount * 5) - [Math]::Min(20, $FindingCount)
    return [Math]::Max(0, $score)
}

function Get-OperatorOSTenantInfo {
    [CmdletBinding()]
    param()

    return [pscustomobject]@{
        tenantId = $env:AZURE_TENANT_ID
        tenantName = $env:OPERATOROS_TENANT_NAME
        user = $env:USERNAME
        domain = $env:USERDNSDOMAIN
    }
}

function Get-OperatorOSMachineInfo {
    [CmdletBinding()]
    param()

    return [pscustomobject]@{
        computerName = $env:COMPUTERNAME
        os = [System.Environment]::OSVersion.VersionString
        powershellVersion = $PSVersionTable.PSVersion.ToString()
        processId = $PID
    }
}

function Export-OperatorOSReport {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [hashtable] $Context,

        [Parameter(Mandatory = $true)]
        [object[]] $Data,

        [ValidateSet('Html', 'Csv', 'Json')]
        [string[]] $Format = @('Json'),

        [string] $FileNamePrefix = $Context.ScriptName
    )

    New-Item -ItemType Directory -Path $Context.OutputPath -Force | Out-Null
    $safePrefix = $FileNamePrefix -replace '[^a-zA-Z0-9\.-]', '-'
    $exports = @()

    foreach ($target in $Format) {
        $path = Join-Path -Path $Context.OutputPath -ChildPath "$safePrefix.$($target.ToLowerInvariant())"

        switch ($target) {
            'Csv' { $Data | Export-Csv -Path $path -NoTypeInformation -Force }
            'Html' {
                $summary = Get-OperatorOSSummary -Context $Context
                $html = $Data | ConvertTo-Html -Title $Context.ScriptName -PreContent "<h1>$($Context.ScriptName)</h1><pre>$($summary | Out-String)</pre>"
                $html | Out-File -FilePath $path -Encoding utf8 -Force
            }
            'Json' { $Data | ConvertTo-Json -Depth 8 | Out-File -FilePath $path -Encoding utf8 -Force }
        }

        $exports += $path
    }

    return $exports
}

function Get-OperatorOSSummary {
    [CmdletBinding()]
    param([Parameter(Mandatory = $true)][hashtable] $Context)

    return [pscustomobject]@{
        script = $Context.ScriptName
        safetyMode = $Context.SafetyMode
        dryRun = $Context.DryRun
        startedAt = $Context.StartedAt
        completedAt = $Context.CompletedAt
        durationSeconds = $Context.DurationSeconds
        healthScore = $Context.HealthScore
        riskScore = $Context.RiskScore
        logCount = $Context.Logs.Count
        exceptionCount = $Context.Exceptions.Count
        evidenceCount = $Context.Evidence.Count
    }
}

function Complete-OperatorOSExecution {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [hashtable] $Context,

        [int] $FindingCount = 0,

        [int] $WarningCount = 0,

        [bool] $RequiresAdmin = $false
    )

    $Context.CompletedAt = Get-Date
    $Context.DurationSeconds = [Math]::Round(($Context.CompletedAt - $Context.StartedAt).TotalSeconds, 2)
    $Context.RiskScore = Get-OperatorOSRiskScore -SafetyMode $Context.SafetyMode -FindingCount $FindingCount -RequiresAdmin:$RequiresAdmin
    $Context.HealthScore = Get-OperatorOSHealthScore -ExceptionCount $Context.Exceptions.Count -WarningCount $WarningCount -FindingCount $FindingCount
    Write-OperatorOSLog -Context $Context -Level Info -Message "Completed $($Context.ScriptName) in $($Context.DurationSeconds) seconds."
    Stop-OperatorOSTranscript -Context $Context
    return Get-OperatorOSSummary -Context $Context
}

Export-ModuleMember -Function @(
    'New-OperatorOSExecutionContext',
    'Import-OperatorOSConfig',
    'Write-OperatorOSLog',
    'Start-OperatorOSTranscript',
    'Stop-OperatorOSTranscript',
    'Assert-OperatorOSPowerShellVersion',
    'Assert-OperatorOSModuleDependency',
    'Assert-OperatorOSPermission',
    'Register-OperatorOSRollbackAction',
    'Invoke-OperatorOSRollback',
    'Invoke-OperatorOSOperation',
    'Add-OperatorOSException',
    'Add-OperatorOSEvidence',
    'Get-OperatorOSRiskScore',
    'Get-OperatorOSHealthScore',
    'Get-OperatorOSTenantInfo',
    'Get-OperatorOSMachineInfo',
    'Export-OperatorOSReport',
    'Get-OperatorOSSummary',
    'Complete-OperatorOSExecution'
)
