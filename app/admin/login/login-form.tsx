"use client";

import { useState, type FormEvent } from "react";

type LoginState =
  | { status: "idle" }
  | { status: "loading"; message: string }
  | { status: "error"; message: string };

export function AdminLoginForm({ defaultEmail }: { defaultEmail: string }) {
  const [state, setState] = useState<LoginState>({ status: "idle" });

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "loading", message: "Signing in..." });

    const response = await fetch("/api/admin/login", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });
    const payload = await response.json();

    if (!response.ok) {
      setState({ status: "error", message: payload.error ?? "Login failed." });
      return;
    }

    window.location.href = "/admin/scripts/review";
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={login}>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
        Email
        <input
          autoComplete="username"
          className="border border-[#24304A] bg-[#0B1020] px-3 py-2 text-[#F8FAFC] outline-none focus:border-[#5E81F4]"
          defaultValue={defaultEmail}
          name="email"
          required
          type="email"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
        Password
        <input
          autoComplete="current-password"
          className="border border-[#24304A] bg-[#0B1020] px-3 py-2 text-[#F8FAFC] outline-none focus:border-[#5E81F4]"
          name="password"
          required
          type="password"
        />
      </label>
      <button className="border border-[#E53935] bg-[#E53935] px-4 py-3 text-sm font-semibold text-white hover:bg-[#c92f2b]">
        Sign In
      </button>
      {state.status !== "idle" ? (
        <div
          className={`border p-3 text-sm ${
            state.status === "error"
              ? "border-rose-800 bg-rose-950/40 text-rose-100"
              : "border-[#24304A] bg-[#0B1020] text-slate-100"
          }`}
        >
          {state.message}
        </div>
      ) : null}
    </form>
  );
}
