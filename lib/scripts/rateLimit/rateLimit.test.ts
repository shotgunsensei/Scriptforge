import { afterEach, describe, expect, it } from "vitest";
import { getRateLimitAdapter, getRateLimitDriverName } from "./index";
import { clearMemoryRateLimits, MemoryRateLimitAdapter } from "./memoryRateLimit";

const originalRateLimitDriver = process.env.RATE_LIMIT_DRIVER;
const originalUpstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const originalUpstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

afterEach(() => {
  clearMemoryRateLimits();
  restoreEnv("RATE_LIMIT_DRIVER", originalRateLimitDriver);
  restoreEnv("UPSTASH_REDIS_REST_URL", originalUpstashUrl);
  restoreEnv("UPSTASH_REDIS_REST_TOKEN", originalUpstashToken);
});

describe("rate limit adapters", () => {
  it("allows requests until the memory bucket limit is exceeded", async () => {
    const adapter = new MemoryRateLimitAdapter();

    await expect(adapter.check("community-submit:test", 2, 60_000)).resolves.toMatchObject({ ok: true, remaining: 1 });
    await expect(adapter.check("community-submit:test", 2, 60_000)).resolves.toMatchObject({ ok: true, remaining: 0 });
    await expect(adapter.check("community-submit:test", 2, 60_000)).resolves.toMatchObject({
      ok: false,
      error: "Rate limit exceeded.",
    });
  });

  it("selects the memory driver by default", () => {
    delete process.env.RATE_LIMIT_DRIVER;

    expect(getRateLimitDriverName()).toBe("memory");
    expect(getRateLimitAdapter()).toBeInstanceOf(MemoryRateLimitAdapter);
  });

  it("fails closed when Upstash is selected without credentials", async () => {
    process.env.RATE_LIMIT_DRIVER = "upstash";
    process.env.UPSTASH_REDIS_REST_URL = "";
    process.env.UPSTASH_REDIS_REST_TOKEN = "";

    const result = await getRateLimitAdapter().check("community-submit:test", 1, 60_000);

    expect(getRateLimitDriverName()).toBe("upstash");
    expect(result.ok).toBe(false);
    expect(result.error).toContain("UPSTASH_REDIS_REST_URL");
  });
});

function restoreEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}
