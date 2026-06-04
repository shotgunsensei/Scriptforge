import type { RateLimitAdapter, RateLimitResult } from "./types";

export class UpstashRateLimitAdapter implements RateLimitAdapter {
  constructor(
    private readonly url = process.env.UPSTASH_REDIS_REST_URL ?? "",
    private readonly token = process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
  ) {}

  async check(_key: string, _limit: number, _windowMs: number): Promise<RateLimitResult> {
    if (!this.url || !this.token) {
      return {
        ok: false,
        remaining: 0,
        resetAt: Date.now(),
        error: "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required when RATE_LIMIT_DRIVER=upstash.",
      };
    }

    return {
      ok: false,
      remaining: 0,
      resetAt: Date.now(),
      error: "Upstash rate limit adapter placeholder. Implement REST atomic increment before production use.",
    };
  }
}
