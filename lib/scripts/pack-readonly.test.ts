import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const fixture = vi.hoisted(() => ({ build: vi.fn() }));
vi.mock("./catalog", () => ({ buildScriptPack: fixture.build }));
import { GET } from "../../app/api/scripts/packs/[pack]/route";
import { SupabaseScriptFileStorage } from "./storage/supabaseStorage";
const originalDriver = process.env.SCRIPT_STORAGE_DRIVER;
afterEach(() => { vi.restoreAllMocks(); fixture.build.mockReset(); if(originalDriver===undefined)delete process.env.SCRIPT_STORAGE_DRIVER;else process.env.SCRIPT_STORAGE_DRIVER=originalDriver; });
describe("public pack delivery boundaries", () => {
 it("denies protected bundles despite spoofed client entitlement, preview and admin assertions", async () => {
  fixture.build.mockResolvedValue({pack:{slug:"ad-pack",label:"AD pack",fileName:"ad-pack.ps1"},scripts:[],body:null,requiresEntitlement:true});
  const response = await GET(new NextRequest("https://example.test/api/scripts/packs/ad-pack?entitled=true&preview=1",{headers:{"x-operatoros-entitlement":"operator",cookie:"scriptforge_admin_session=synthetic-admin-assertion"}}),{params:Promise.resolve({pack:"ad-pack"})});
  expect(response.status).toBe(503);expect(response.headers.get("cache-control")).toBe("no-store");
  expect(await response.text()).toContain("entitlement verification");
 });
 it("returns an explicitly public pack without uploading or writing even in database mode", async () => {
  process.env.SCRIPT_STORAGE_DRIVER="database";
  const upload = vi.spyOn(SupabaseScriptFileStorage.prototype,"uploadBytes").mockRejectedValue(new Error("No GET writes permitted"));
  fixture.build.mockResolvedValue({pack:{slug:"ad-pack",label:"AD pack",fileName:"ad-pack.ps1"},scripts:[{}],body:"Write-Output 'synthetic free fixture'",requiresEntitlement:false});
  const response = await GET(new NextRequest("https://example.test/api/scripts/packs/ad-pack"),{params:Promise.resolve({pack:"ad-pack"})});
  expect(response.status).toBe(200);expect(response.headers.get("content-type")).toBe("application/zip");
  expect(upload).not.toHaveBeenCalled();expect(response.headers.has("x-scriptforge-storage-uri")).toBe(false);
  expect((await response.arrayBuffer()).byteLength).toBeGreaterThan(0);
 });
});
