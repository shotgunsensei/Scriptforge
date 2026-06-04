export type RateLimitDriverName = "memory" | "upstash";

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
  error?: string;
};

export interface RateLimitAdapter {
  check(key: string, limit: number, windowMs: number): Promise<RateLimitResult>;
}
