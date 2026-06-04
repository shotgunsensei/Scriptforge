import type { RateLimitAdapter, RateLimitResult } from "./types";

export class UpstashRateLimitAdapter implements RateLimitAdapter {
  constructor(
    private readonly url = process.env.UPSTASH_REDIS_REST_URL ?? "",
    private readonly token = process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
  ) {}

  async check(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    if (!this.url || !this.token) {
      return {
        ok: false,
        remaining: 0,
        resetAt: Date.now(),
        error: "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required when RATE_LIMIT_DRIVER=upstash.",
      };
    }

    const redisKey = `scriptforge:rate:${key}`;
    const count = Number(await this.command(["INCR", redisKey]));

    if (count === 1) {
      await this.command(["PEXPIRE", redisKey, String(windowMs)]);
    }

    const ttl = Math.max(Number(await this.command(["PTTL", redisKey])), 0);
    const resetAt = Date.now() + ttl;
    const remaining = Math.max(0, limit - count);

    return {
      ok: count <= limit,
      remaining,
      resetAt,
      error: count <= limit ? undefined : "Rate limit exceeded.",
    };
  }

  private async command(command: string[]) {
    const response = await fetch(`${this.url.replace(/\/$/, "")}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(command),
    });

    if (!response.ok) {
      throw new Error(`Upstash Redis request failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as { result?: unknown; error?: string };

    if (payload.error) {
      throw new Error(payload.error);
    }

    return payload.result;
  }
}
