export type CaptchaResult = {
  ok: boolean;
  error?: string;
};

export function isCaptchaEnabled(): boolean {
  return (process.env.ENABLE_CAPTCHA ?? "false").toLowerCase() === "true";
}

export async function verifyTurnstileToken(token: string | null | undefined, remoteIp?: string): Promise<CaptchaResult> {
  if (!isCaptchaEnabled()) {
    return { ok: true };
  }

  if (!token) {
    return { ok: false, error: "Captcha token is required." };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return { ok: false, error: "TURNSTILE_SECRET_KEY is required when ENABLE_CAPTCHA=true." };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const payload = (await response.json()) as { success?: boolean };

  return payload.success ? { ok: true } : { ok: false, error: "Captcha verification failed." };
}
