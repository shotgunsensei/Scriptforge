import { describe, expect, it } from "vitest";
import { scanPowerShellScript } from "./safetyScanner";

describe("static PowerShell safety scanner", () => {
  it("returns standard review for safe read-only scripts", () => {
    const result = scanPowerShellScript(`
      $os = Get-CimInstance Win32_OperatingSystem
      $os.Caption
    `);

    expect(result.risk_score).toBe(0);
    expect(result.matched_patterns).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(result.recommended_review_level).toBe("standard");
  });

  it("flags medium-risk scripts for elevated review", () => {
    const result = scanPowerShellScript(`
      Invoke-WebRequest -Uri "https://example.com/tool.ps1" -OutFile "$env:TEMP\\tool.ps1"
      Start-Process powershell.exe -ArgumentList "-File $env:TEMP\\tool.ps1"
    `);

    expect(result.risk_score).toBeGreaterThanOrEqual(15);
    expect(result.risk_score).toBeLessThan(40);
    expect(result.matched_patterns.map((pattern) => pattern.id)).toEqual(
      expect.arrayContaining(["invoke_web_request", "start_process"]),
    );
    expect(result.warnings.length).toBeGreaterThanOrEqual(2);
    expect(result.recommended_review_level).toBe("elevated");
  });

  it("flags high-risk identity and consent changes for blocking security review", () => {
    const result = scanPowerShellScript(`
      powershell.exe -EncodedCommand SQBFAFgA
      New-MgOauth2PermissionGrant -ClientId $clientId -ConsentType AllPrincipals
      New-LocalUser -Name "svc-backup" -Password $password
      Add-LocalGroupMember -Group Administrators -Member "svc-backup"
    `);

    expect(result.risk_score).toBeGreaterThanOrEqual(70);
    expect(result.matched_patterns.map((pattern) => pattern.id)).toEqual(
      expect.arrayContaining([
        "encoded_command",
        "graph_permission_grant_changes",
        "oauth_app_consent_changes",
        "user_creation",
        "role_assignment_changes",
      ]),
    );
    expect(result.warnings.some((warning) => warning.includes("Graph permission grants"))).toBe(true);
    expect(result.recommended_review_level).toBe("block_until_review");
  });
});
