import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, getAdminSeedConfig, verifyUserSessionToken } from "../../../lib/scripts/admin-users";
import { AdminLoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login | OperatorOS ScriptForge",
  description: "Sign in to the OperatorOS ScriptForge admin console.",
};

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const principal = await verifyUserSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (principal) {
    redirect("/admin/scripts/review");
  }

  const seedConfig = getAdminSeedConfig();

  return (
    <main className="min-h-screen px-5 py-10 text-slate-100 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-xl border border-[#24304A] bg-[#121A2E] p-6 shadow-2xl shadow-black/30">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5E81F4]">OperatorOS ScriptForge</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">Admin Login</h1>
        <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
          Sign in with a seeded ScriptForge admin account. Run <code>npm run seed:admin</code> after setting
          <code> SCRIPTFORGE_ADMIN_SEED_PASSWORD</code> if this is a new environment.
        </p>
        <AdminLoginForm defaultEmail={seedConfig.email} />
      </section>
    </main>
  );
}
