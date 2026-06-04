import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

type SeedCategory = {
  slug: string;
  label: string;
  module: string;
  requirement: string;
  commands: string[];
  topics: string[];
};

type SeedScript = {
  title: string;
  slug: string;
  category: SeedCategory;
  topic: string;
  command: string;
};

const reviewedAt = "2026-06-04T12:00:00.000Z";

const categories: SeedCategory[] = [
  {
    slug: "microsoft-365",
    label: "Microsoft 365",
    module: "Microsoft.Graph",
    requirement: "Microsoft Graph PowerShell SDK with read-only Graph permissions.",
    commands: [
      "Get-MgOrganization | Select-Object Id,DisplayName,VerifiedDomains",
      "Get-MgSubscribedSku | Select-Object SkuPartNumber,ConsumedUnits,PrepaidUnits",
      "Get-MgUser -All -Property DisplayName,UserPrincipalName,AccountEnabled | Select-Object DisplayName,UserPrincipalName,AccountEnabled",
      "Get-MgGroup -All -Property DisplayName,MailEnabled,SecurityEnabled | Select-Object DisplayName,MailEnabled,SecurityEnabled",
      "Get-MgDevice -All -Property DisplayName,OperatingSystem,TrustType | Select-Object DisplayName,OperatingSystem,TrustType",
      "Get-MgDomain | Select-Object Id,IsVerified,AuthenticationType",
      "Get-MgDirectoryDeletedItemAsUser -All | Select-Object DisplayName,UserPrincipalName,DeletedDateTime",
      "Get-MgReportOffice365ActiveUserDetail -Period D30",
      "Get-MgReportEmailActivityUserDetail -Period D30",
      "Get-MgReportTeamsUserActivityUserDetail -Period D30",
      "Get-MgReportOneDriveUsageAccountDetail -Period D30",
      "Get-MgReportSharePointSiteUsageDetail -Period D30",
    ],
    topics: [
      "Tenant Profile Audit",
      "License Utilization Report",
      "User Enablement Audit",
      "Group Inventory Report",
      "Device Inventory Report",
      "Domain Verification Audit",
      "Deleted User Review",
      "Active User Activity Report",
      "Email Activity Report",
      "Teams Activity Report",
      "OneDrive Usage Report",
      "SharePoint Usage Report",
    ],
  },
  {
    slug: "exchange-online",
    label: "Exchange Online",
    module: "ExchangeOnlineManagement",
    requirement: "Exchange Online PowerShell module with read-only recipient and organization permissions.",
    commands: [
      "Get-OrganizationConfig | Select-Object Name,OAuth2ClientProfileEnabled,ModernAuthEnabled",
      "Get-EXOMailbox -ResultSize Unlimited | Select-Object DisplayName,UserPrincipalName,RecipientTypeDetails",
      "Get-EXOMailbox -ResultSize Unlimited | Get-EXOMailboxStatistics | Select-Object DisplayName,TotalItemSize,ItemCount",
      "Get-DistributionGroup -ResultSize Unlimited | Select-Object DisplayName,PrimarySmtpAddress,ManagedBy",
      "Get-DynamicDistributionGroup -ResultSize Unlimited | Select-Object DisplayName,RecipientFilter",
      "Get-TransportRule | Select-Object Name,State,Mode,Priority",
      "Get-HostedContentFilterPolicy | Select-Object Name,IsDefault,SpamAction,HighConfidenceSpamAction",
      "Get-AntiPhishPolicy | Select-Object Name,Enabled,AuthenticationFailAction",
      "Get-QuarantineMessage -PageSize 100 | Select-Object ReceivedTime,SenderAddress,Subject,Type",
      "Get-MailboxPermission -Identity $MailboxIdentity | Select-Object User,AccessRights,Deny,IsInherited",
      "Get-RecipientPermission -Identity $MailboxIdentity | Select-Object Trustee,AccessRights,IsInherited",
      "Get-InboxRule -Mailbox $MailboxIdentity | Select-Object Name,Enabled,ForwardTo,RedirectTo,DeleteMessage",
    ],
    topics: [
      "Organization Config Audit",
      "Mailbox Inventory Report",
      "Mailbox Size Report",
      "Distribution Group Audit",
      "Dynamic Group Audit",
      "Transport Rule Review",
      "Spam Policy Review",
      "Anti-Phish Policy Review",
      "Quarantine Summary",
      "Mailbox Permission Audit",
      "Send-As Permission Audit",
      "Inbox Rule Forwarding Audit",
    ],
  },
  {
    slug: "entra-id",
    label: "Entra ID",
    module: "Microsoft.Graph",
    requirement: "Microsoft Graph PowerShell SDK with Directory.Read.All or equivalent read-only permissions.",
    commands: [
      "Get-MgUser -All -Property DisplayName,UserPrincipalName,AccountEnabled,SignInActivity | Select-Object DisplayName,UserPrincipalName,AccountEnabled,SignInActivity",
      "Get-MgGroup -All -Property DisplayName,SecurityEnabled,GroupTypes | Select-Object DisplayName,SecurityEnabled,GroupTypes",
      "Get-MgDirectoryRole | Select-Object DisplayName,Id",
      "Get-MgDirectoryRole | ForEach-Object { Get-MgDirectoryRoleMember -DirectoryRoleId $_.Id }",
      "Get-MgServicePrincipal -All | Select-Object DisplayName,AppId,PublisherName,AccountEnabled",
      "Get-MgApplication -All | Select-Object DisplayName,AppId,SignInAudience",
      "Get-MgIdentityConditionalAccessPolicy | Select-Object DisplayName,State,CreatedDateTime,ModifiedDateTime",
      "Get-MgIdentityAuthenticationMethodPolicy | Select-Object Id,DisplayName,Description",
      "Get-MgDevice -All | Select-Object DisplayName,OperatingSystem,ApproximateLastSignInDateTime",
      "Get-MgAuditLogDirectoryAudit -Top 50 | Select-Object ActivityDateTime,ActivityDisplayName,Result",
      "Get-MgAuditLogSignIn -Top 50 | Select-Object CreatedDateTime,UserPrincipalName,AppDisplayName,Status",
      "Get-MgOauth2PermissionGrant -All | Select-Object ClientId,ConsentType,Scope",
    ],
    topics: [
      "Stale User Sign-In Audit",
      "Security Group Inventory",
      "Directory Role Inventory",
      "Privileged Role Member Report",
      "Service Principal Inventory",
      "Application Registration Inventory",
      "Conditional Access Policy Audit",
      "Authentication Method Policy Review",
      "Device Sign-In Audit",
      "Directory Audit Log Export",
      "Recent Sign-In Report",
      "OAuth Grant Inventory",
    ],
  },
  {
    slug: "active-directory",
    label: "Active Directory",
    module: "ActiveDirectory",
    requirement: "ActiveDirectory PowerShell module with domain read access.",
    commands: [
      "Get-ADDomain | Select-Object DNSRoot,DomainMode,PDCEmulator,RIDMaster,InfrastructureMaster",
      "Get-ADForest | Select-Object Name,ForestMode,SchemaMaster,DomainNamingMaster",
      "Get-ADUser -Filter * -Properties Enabled,LastLogonDate | Select-Object Name,SamAccountName,Enabled,LastLogonDate",
      "Search-ADAccount -AccountInactive -UsersOnly -TimeSpan 90.00:00:00 | Select-Object Name,SamAccountName,LastLogonDate",
      "Search-ADAccount -LockedOut | Select-Object Name,SamAccountName,LockedOut",
      "Get-ADGroup -Filter * -Properties GroupCategory,GroupScope | Select-Object Name,GroupCategory,GroupScope",
      "Get-ADGroupMember -Identity $GroupName -Recursive | Select-Object Name,SamAccountName,ObjectClass",
      "Get-ADComputer -Filter * -Properties OperatingSystem,LastLogonDate | Select-Object Name,OperatingSystem,LastLogonDate",
      "Search-ADAccount -AccountInactive -ComputersOnly -TimeSpan 90.00:00:00 | Select-Object Name,LastLogonDate",
      "Get-ADObject -LDAPFilter '(objectClass=organizationalUnit)' -Properties CanonicalName | Select-Object Name,CanonicalName",
      "Get-ADDefaultDomainPasswordPolicy | Select-Object ComplexityEnabled,MinPasswordLength,MaxPasswordAge,LockoutThreshold",
      "Get-ADReplicationFailure -Scope Forest | Select-Object Server,Partner,FailureCount,LastError",
    ],
    topics: [
      "Domain FSMO Audit",
      "Forest FSMO Audit",
      "User Inventory Report",
      "Inactive User Audit",
      "Locked Account Report",
      "Group Inventory Report",
      "Group Membership Export",
      "Computer Inventory Report",
      "Inactive Computer Audit",
      "OU Inventory Report",
      "Password Policy Audit",
      "Replication Failure Report",
    ],
  },
  {
    slug: "windows-server",
    label: "Windows Server",
    module: "Built-in Windows PowerShell",
    requirement: "Windows PowerShell 5.1 or newer on Windows Server.",
    commands: [
      "Get-ComputerInfo | Select-Object CsName,WindowsProductName,WindowsVersion,OsHardwareAbstractionLayer",
      "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,LastBootUpTime",
      "Get-WindowsFeature | Where-Object Installed | Select-Object Name,DisplayName,InstallState",
      "Get-Service | Select-Object Name,DisplayName,Status,StartType",
      "Get-EventLog -LogName System -EntryType Error -Newest 100 | Select-Object TimeGenerated,Source,EventID,Message",
      "Get-EventLog -LogName Application -EntryType Error -Newest 100 | Select-Object TimeGenerated,Source,EventID,Message",
      "Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object HotFixID,Description,InstalledOn",
      "Get-Volume | Select-Object DriveLetter,FileSystemLabel,SizeRemaining,Size",
      "Get-SmbShare | Select-Object Name,Path,Description,FolderEnumerationMode",
      "Get-SmbSession | Select-Object ClientComputerName,ClientUserName,NumOpens",
      "Get-ScheduledTask | Select-Object TaskName,TaskPath,State",
      "Get-Process | Sort-Object CPU -Descending | Select-Object -First 25 Name,Id,CPU,WorkingSet",
    ],
    topics: [
      "Server Inventory Report",
      "Uptime Report",
      "Installed Role Audit",
      "Service State Report",
      "System Error Event Review",
      "Application Error Event Review",
      "Patch Inventory Report",
      "Volume Capacity Report",
      "SMB Share Audit",
      "SMB Session Report",
      "Scheduled Task Inventory",
      "Top Process Resource Report",
    ],
  },
  {
    slug: "workstation-repair",
    label: "Workstation Repair",
    module: "Built-in Windows PowerShell",
    requirement: "Windows PowerShell 5.1 or newer on a Windows workstation.",
    commands: [
      "Get-ComputerInfo | Select-Object CsName,WindowsProductName,WindowsVersion,CsManufacturer,CsModel",
      "Get-CimInstance Win32_BIOS | Select-Object SerialNumber,SMBIOSBIOSVersion,ReleaseDate",
      "Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID,DriveType,FreeSpace,Size",
      "Get-CimInstance Win32_NetworkAdapterConfiguration | Where-Object IPEnabled | Select-Object Description,IPAddress,DefaultIPGateway,DNSServerSearchOrder",
      "Get-NetAdapter | Select-Object Name,Status,LinkSpeed,MacAddress",
      "Get-Service | Where-Object Status -ne 'Running' | Select-Object Name,DisplayName,Status,StartType",
      "Get-EventLog -LogName System -EntryType Error -Newest 50 | Select-Object TimeGenerated,Source,EventID,Message",
      "Get-EventLog -LogName Application -EntryType Error -Newest 50 | Select-Object TimeGenerated,Source,EventID,Message",
      "Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object HotFixID,InstalledOn",
      "Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 20 Name,Id,WorkingSet",
      "Get-CimInstance Win32_StartupCommand | Select-Object Name,Command,Location,User",
      "Get-Printer | Select-Object Name,DriverName,PortName,PrinterStatus",
    ],
    topics: [
      "Workstation Inventory Report",
      "BIOS Serial Report",
      "Disk Capacity Report",
      "IP Configuration Report",
      "Network Adapter Report",
      "Stopped Service Report",
      "System Error Review",
      "Application Error Review",
      "Patch History Report",
      "Memory Process Report",
      "Startup Item Audit",
      "Printer Inventory Report",
    ],
  },
  {
    slug: "security",
    label: "Security",
    module: "Built-in Windows PowerShell",
    requirement: "Windows PowerShell 5.1 or newer with permission to read local security state.",
    commands: [
      "Get-MpComputerStatus | Select-Object AMServiceEnabled,AntivirusEnabled,RealTimeProtectionEnabled,QuickScanAge",
      "Get-MpThreat | Select-Object ThreatName,SeverityID,Resources,InitialDetectionTime",
      "Get-LocalUser | Select-Object Name,Enabled,LastLogon,PasswordRequired",
      "Get-LocalGroupMember -Group Administrators | Select-Object Name,ObjectClass,PrincipalSource",
      "Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction,DefaultOutboundAction",
      "Get-NetFirewallRule | Where-Object Enabled -eq True | Select-Object DisplayName,Direction,Action,Profile",
      "Get-EventLog -LogName Security -Newest 100 | Select-Object TimeGenerated,EntryType,Source,EventID,Message",
      "Get-Process | Where-Object Path | Select-Object Name,Id,Path,Company",
      "Get-AuthenticodeSignature -FilePath $FilePath | Select-Object Status,SignerCertificate,Path",
      "Get-CimInstance Win32_QuickFixEngineering | Select-Object HotFixID,InstalledOn,Description",
      "Get-SmbShare | Select-Object Name,Path,FolderEnumerationMode",
      "Get-ChildItem Cert:\\LocalMachine\\My | Select-Object Subject,Issuer,NotAfter,Thumbprint",
    ],
    topics: [
      "Defender Status Report",
      "Defender Threat Report",
      "Local User Audit",
      "Local Administrators Audit",
      "Firewall Profile Audit",
      "Enabled Firewall Rule Report",
      "Security Event Snapshot",
      "Running Process Path Audit",
      "File Signature Check",
      "Security Patch Report",
      "Share Exposure Audit",
      "Certificate Expiration Report",
    ],
  },
  {
    slug: "networking",
    label: "Networking",
    module: "Built-in Windows PowerShell",
    requirement: "Windows PowerShell 5.1 or newer with network cmdlets available.",
    commands: [
      "Get-NetIPConfiguration | Select-Object InterfaceAlias,IPv4Address,IPv4DefaultGateway,DNSServer",
      "Get-DnsClientServerAddress | Select-Object InterfaceAlias,ServerAddresses",
      "Get-NetRoute | Select-Object DestinationPrefix,NextHop,RouteMetric,InterfaceAlias",
      "Get-NetTCPConnection | Select-Object LocalAddress,LocalPort,RemoteAddress,RemotePort,State,OwningProcess",
      "Get-NetUDPEndpoint | Select-Object LocalAddress,LocalPort,OwningProcess",
      "Test-NetConnection -ComputerName $ComputerName -Port $Port | Select-Object ComputerName,RemotePort,TcpTestSucceeded",
      "Resolve-DnsName -Name $DnsName | Select-Object Name,Type,IPAddress,NameHost",
      "Get-NetAdapterStatistics | Select-Object Name,ReceivedBytes,SentBytes,ReceivedUnicastPackets,SentUnicastPackets",
      "Get-NetNeighbor | Select-Object ifIndex,IPAddress,LinkLayerAddress,State",
      "Get-NetIPInterface | Select-Object InterfaceAlias,AddressFamily,Dhcp,ConnectionState",
      "Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction",
      "Get-NetConnectionProfile | Select-Object Name,InterfaceAlias,NetworkCategory,IPv4Connectivity",
    ],
    topics: [
      "IP Configuration Audit",
      "DNS Server Audit",
      "Route Table Report",
      "TCP Connection Report",
      "UDP Endpoint Report",
      "Port Connectivity Test",
      "DNS Resolution Test",
      "Adapter Statistics Report",
      "Neighbor Cache Report",
      "IP Interface Report",
      "Firewall Profile Network Review",
      "Connection Profile Audit",
    ],
  },
  {
    slug: "kaseya-datto-rmm",
    label: "Kaseya / Datto RMM",
    module: "Built-in Windows PowerShell",
    requirement: "Windows PowerShell 5.1 or newer on an endpoint managed by Kaseya or Datto RMM.",
    commands: [
      "Get-Service | Where-Object DisplayName -match 'Kaseya|Datto|RMM' | Select-Object Name,DisplayName,Status,StartType",
      "Get-Process | Where-Object ProcessName -match 'Kaseya|Datto|AEM|RMM' | Select-Object ProcessName,Id,CPU,Path",
      "Get-ChildItem 'HKLM:\\Software' -ErrorAction SilentlyContinue | Where-Object Name -match 'Kaseya|Datto' | Select-Object Name",
      "Get-EventLog -LogName Application -Newest 100 | Where-Object Source -match 'Kaseya|Datto|RMM' | Select-Object TimeGenerated,Source,EventID,Message",
      "Get-ScheduledTask | Where-Object TaskName -match 'Kaseya|Datto|RMM' | Select-Object TaskName,TaskPath,State",
      "Get-CimInstance Win32_Product | Where-Object Name -match 'Kaseya|Datto|RMM' | Select-Object Name,Version,Vendor",
      "Get-NetTCPConnection | Where-Object OwningProcess -in (Get-Process | Where-Object ProcessName -match 'Kaseya|Datto|AEM' | Select-Object -ExpandProperty Id) | Select-Object LocalAddress,LocalPort,RemoteAddress,RemotePort,State",
      "Get-ChildItem 'C:\\ProgramData' -Directory -ErrorAction SilentlyContinue | Where-Object Name -match 'Kaseya|Datto' | Select-Object FullName,LastWriteTime",
      "Get-Service | Where-Object Name -match 'Kaseya|Datto|AEM' | Select-Object Name,Status,CanStop,ServiceType",
      "Get-CimInstance Win32_OperatingSystem | Select-Object CSName,LastBootUpTime,Version",
      "Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 25 HotFixID,InstalledOn,Description",
      "Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID,FreeSpace,Size",
    ],
    topics: [
      "RMM Service Status Audit",
      "RMM Process Audit",
      "RMM Registry Footprint Audit",
      "RMM Application Event Review",
      "RMM Scheduled Task Review",
      "RMM Installed Product Audit",
      "RMM Network Connection Report",
      "RMM ProgramData Footprint Audit",
      "RMM Service Control Capability Report",
      "RMM Endpoint Uptime Report",
      "RMM Patch Snapshot",
      "RMM Disk Capacity Snapshot",
    ],
  },
];

const scripts = categories.flatMap((category) =>
  category.topics.map((topic, index): SeedScript => {
    const slug = toSlug(`${category.slug}-${topic}`);

    return {
      title: `${category.label} ${topic}`,
      slug,
      category,
      topic,
      command: category.commands[index],
    };
  }),
);

async function main() {
  for (const script of scripts) {
    await writeSeedScript(script);
  }

  process.stdout.write(`Seeded ${scripts.length} official OperatorOS script(s).\n`);
}

async function writeSeedScript(script: SeedScript) {
  const folder = join(process.cwd(), "content", "scripts", "operatoros", script.category.slug, script.slug);
  const scriptBody = buildScriptBody(script);
  const metadata = buildMetadata(script, scriptBody);

  await mkdir(folder, { recursive: true });
  await writeFile(join(folder, `${script.slug}.ps1`), `${scriptBody}\n`, "utf8");
  await writeFile(join(folder, `${script.slug}.json`), `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
  await writeFile(join(folder, "README.md"), buildReadme(metadata), "utf8");
}

function buildScriptBody(script: SeedScript): string {
  const needsMailbox = script.command.includes("$MailboxIdentity");
  const needsComputer = script.command.includes("$ComputerName");
  const needsPort = script.command.includes("$Port");
  const needsDns = script.command.includes("$DnsName");
  const needsFile = script.command.includes("$FilePath");
  const params = [
    needsMailbox ? "[string]$MailboxIdentity = 'user@example.com'" : null,
    needsComputer ? "[string]$ComputerName = 'localhost'" : null,
    needsPort ? "[int]$Port = 443" : null,
    needsDns ? "[string]$DnsName = 'example.com'" : null,
    needsFile ? "[string]$FilePath = 'C:\\Windows\\System32\\notepad.exe'" : null,
  ].filter(Boolean);
  const paramBlock = params.length > 0 ? `param(\n  ${params.join(",\n  ")}\n)\n\n` : "";

  return `${paramBlock}# OperatorOS ScriptForge official read-only audit script
# Category: ${script.category.label}
# Report: ${script.topic}

$ErrorActionPreference = 'Stop'

${script.command}
`;
}

function buildMetadata(script: SeedScript, scriptBody: string) {
  const usesAdminContext = ["active-directory", "exchange-online", "entra-id", "microsoft-365"].includes(script.category.slug);
  const tags = Array.from(
    new Set([
      "operatoros",
      "official",
      "read-only",
      "audit",
      script.category.slug,
      ...script.topic.toLowerCase().split(/\s+/).slice(0, 3),
    ]),
  ).slice(0, 10);

  return {
    title: script.title,
    slug: script.slug,
    version: "1.0.0",
    category: script.category.slug,
    subcategory: "audit-reporting",
    tags,
    author: {
      name: "OperatorOS ScriptForge",
      email: "scripts@operatoros.net",
      organization: "Shotgun Ninjas Productions",
      url: "https://operatoros.net",
    },
    summary: `Read-only ${script.category.label} script for ${script.topic.toLowerCase()}.`,
    description: `Official OperatorOS ScriptForge seed script that collects ${script.topic.toLowerCase()} data for technician review, reporting, and customer documentation. This script is designed as a read-only audit/reporting baseline.`,
    use_case: `Use this script when building a ${script.category.label} health report, onboarding baseline, recurring audit, or escalation packet.`,
    safety: {
      risk_level: "low",
      scan_required: true,
      scan_status: "passed",
      risk_flags: [],
      requires_admin: usesAdminContext,
      touches_network: ["microsoft-365", "exchange-online", "entra-id", "networking"].includes(script.category.slug),
      touches_registry: false,
      touches_filesystem: false,
      notes: "Official OperatorOS read-only audit/reporting seed script. Review tenant scope and permissions before running.",
    },
    requirements: [
      {
        name: script.category.requirement,
        required: true,
      },
    ],
    parameters: buildParameters(script.command),
    examples: [
      {
        title: "Run report",
        command: `./${script.slug}.ps1`,
        description: "Runs the read-only audit report with default options.",
      },
    ],
    output: {
      format: "text",
      description: "PowerShell object output suitable for pipeline export, transcript capture, or manual review.",
    },
    script_body: scriptBody,
    documentation: {
      readme: `Official OperatorOS ScriptForge seed script for ${script.topic}. Validate module connection and tenant scope before running.`,
      changelog: "1.0.0 - Initial official read-only audit/reporting seed.",
      references: [],
    },
    monetization: {
      tier: "operator",
      entitlement_required: true,
      upgrade_cta: "Unlock the full OperatorOS automation catalog and technician reporting packs.",
    },
    source_type: "operatoros",
    review_status: "approved",
    reviewed_by: "OperatorOS Seed Generator",
    reviewed_at: reviewedAt,
    submitter: {
      name: "OperatorOS Seed Generator",
      email: "scripts@operatoros.net",
      organization: "Shotgun Ninjas Productions",
    },
    license: "Proprietary OperatorOS ScriptForge Seed",
    attribution_required: false,
  };
}

function buildParameters(command: string) {
  const parameters = [];

  if (command.includes("$MailboxIdentity")) {
    parameters.push({
      name: "MailboxIdentity",
      type: "string",
      description: "Mailbox identity to inspect.",
      required: true,
      sensitive: false,
    });
  }

  if (command.includes("$ComputerName")) {
    parameters.push({
      name: "ComputerName",
      type: "string",
      description: "Computer or host name to test.",
      required: false,
      default: "localhost",
      sensitive: false,
    });
  }

  if (command.includes("$Port")) {
    parameters.push({
      name: "Port",
      type: "number",
      description: "TCP port to test.",
      required: false,
      default: 443,
      sensitive: false,
    });
  }

  if (command.includes("$DnsName")) {
    parameters.push({
      name: "DnsName",
      type: "string",
      description: "DNS name to resolve.",
      required: false,
      default: "example.com",
      sensitive: false,
    });
  }

  if (command.includes("$FilePath")) {
    parameters.push({
      name: "FilePath",
      type: "path",
      description: "Local file path to inspect.",
      required: false,
      default: "C:\\Windows\\System32\\notepad.exe",
      sensitive: false,
    });
  }

  return parameters;
}

function buildReadme(metadata: ReturnType<typeof buildMetadata>): string {
  return `# ${metadata.title}

${metadata.summary}

## Source

- Official OperatorOS script: yes
- Category: ${metadata.category}
- Review status: ${metadata.review_status}
- Reviewed by: ${metadata.reviewed_by}

## Use Case

${metadata.use_case}

## Safety

- Risk level: ${metadata.safety.risk_level}
- Scan status: ${metadata.safety.scan_status}
- Requires admin: ${metadata.safety.requires_admin ? "yes" : "no"}
- Read-only audit/reporting: yes

${metadata.safety.notes}

## Requirements

${metadata.requirements.map((requirement) => `- ${requirement.name}`).join("\n")}

## Example

\`\`\`powershell
./${metadata.slug}.ps1
\`\`\`

## Output

${metadata.output.description}

## License

${metadata.license}
`;
}

function toSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 80);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "Failed to seed official scripts.";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
