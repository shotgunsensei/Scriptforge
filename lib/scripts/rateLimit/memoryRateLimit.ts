import type { RateLimitAdapter, RateLimitResult } from "./types";

const buckets = new Map<string, { count: number; resetAt: number }>();

export class MemoryRateLimitAdapter implements RateLimitAdapter {
  async check(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const now = Date.now();
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
    }

    current.count += 1;
    const remaining = Math.max(0, limit - current.count);

    return {
      ok: current.count <= limit,
      remaining,
      resetAt: current.resetAt,
      error: current.count <= limit ? undefined : "Rate limit exceeded.",
    };
  }
}

export function clearMemoryRateLimits() {
  buckets.clear();
}
