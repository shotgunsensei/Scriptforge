import { afterEach, describe, expect, it, vi } from "vitest";
import { isCaptchaEnabled, verifyTurnstileToken } from "./captcha";

const originalEnableCaptcha = process.env.ENABLE_CAPTCHA;
const originalTurnstileSecret = process.env.TURNSTILE_SECRET_KEY;

afterEach(() => {
  restoreEnv("ENABLE_CAPTCHA", originalEnableCaptcha);
  restoreEnv("TURNSTILE_SECRET_KEY", originalTurnstileSecret);
  vi.restoreAllMocks();
});

describe("captcha verification", () => {
  it("passes when captcha is disabled", async () => {
    process.env.ENABLE_CAPTCHA = "false";

    await expect(verifyTurnstileToken(undefined)).resolves.toEqual({ ok: true });
    expect(isCaptchaEnabled()).toBe(false);
  });

  it("requires a token when captcha is enabled", async () => {
    process.env.ENABLE_CAPTCHA = "true";

    await expect(verifyTurnstileToken("")).resolves.toEqual({
      ok: false,
      error: "Captcha token is required.",
    });
  });

  it("requires TURNSTILE_SECRET_KEY when captcha is enabled", async () => {
    process.env.ENABLE_CAPTCHA = "true";
    process.env.TURNSTILE_SECRET_KEY = "";

    await expect(verifyTurnstileToken("token")).resolves.toEqual({
      ok: false,
      error: "TURNSTILE_SECRET_KEY is required when ENABLE_CAPTCHA=true.",
    });
  });

  it("validates Turnstile tokens through the siteverify endpoint", async () => {
    process.env.ENABLE_CAPTCHA = "true";
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      json: async () => ({ success: true }),
    } as Response);

    await expect(verifyTurnstileToken("token", "127.0.0.1")).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({ method: "POST" }),
    );
  });
});

function restoreEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}
