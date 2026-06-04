import { MemoryRateLimitAdapter } from "./memoryRateLimit";
import { UpstashRateLimitAdapter } from "./upstashRateLimit";
import type { RateLimitAdapter, RateLimitDriverName } from "./types";

export function getRateLimitAdapter(): RateLimitAdapter {
  return getRateLimitDriverName() === "upstash" ? new UpstashRateLimitAdapter() : new MemoryRateLimitAdapter();
}

export function getRateLimitDriverName(): RateLimitDriverName {
  return process.env.RATE_LIMIT_DRIVER === "upstash" ? "upstash" : "memory";
}
