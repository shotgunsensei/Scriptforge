import { CategoryCard } from "./components/brand/CategoryCard";
import { Hero } from "./components/brand/Hero";
import { BrandScriptCard } from "./components/brand/ScriptCard";
import { listPublicScripts } from "../lib/scripts/catalog";

const categories = [
  ["Microsoft 365", "/scripts/category/microsoft-365", "/icons/microsoft-365.svg"],
  ["Exchange", "/scripts/category/exchange-online", "/icons/exchange.svg"],
  ["Entra ID", "/scripts/category/entra-id", "/icons/entra-id.svg"],
  ["Active Directory", "/scripts/category/active-directory", "/icons/active-directory.svg"],
  ["Windows Server", "/scripts/category/windows-server", "/icons/windows-server.svg"],
  ["Security", "/scripts/category/security", "/icons/security.svg"],
  ["Networking", "/scripts/category/networking", "/icons/networking.svg"],
  ["Datto RMM", "/scripts/category/kaseya-datto-rmm", "/icons/datto-rmm.svg"],
  ["Healthcare IT", "/scripts?tag=healthcare", "/icons/healthcare-it.svg"],
  ["PowerShell Utilities", "/scripts?tag=powershell", "/icons/powershell-utilities.svg"],
] as const;

export default async function HomePage() {
  const scripts = await listPublicScripts({ source: "operatoros" });
  const featured = scripts.slice(0, 4);

  return (
    <main className="min-h-screen text-[#F8FAFC]">
      <Hero />
      <section className="px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Scripts" value="125" />
          <Stat label="Categories" value="18" />
          <Stat label="Downloads" value="3,500" />
          <Stat label="Cost" value="100% Free" />
        </div>
      </section>
      <section className="px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map(([title, href, icon]) => (
              <CategoryCard href={href} icon={icon} key={title} title={title} />
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Featured Scripts</h2>
              <p className="mt-2 text-sm text-[#94A3B8]">Verified OperatorOS automation for common MSP workflows.</p>
            </div>
            <a className="text-sm font-semibold text-[#5E81F4]" href="/scripts/operatoros">Browse all official scripts</a>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((script) => (
              <BrandScriptCard key={script.slug} script={script} />
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 border border-[#24304A] bg-[#121A2E] p-6 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="text-2xl font-semibold">Community Scripts</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#94A3B8]">
              Community submissions are separated from official OperatorOS scripts and reviewed before they appear in the public library.
            </p>
            <a className="mt-5 inline-block border border-[#5E81F4] bg-[#5E81F4] px-4 py-2 text-sm font-semibold text-white" href="/community/submit">Submit Script</a>
          </div>
          <img alt="" className="w-full border border-[#24304A]" src="/illustrations/submission-page.svg" />
        </div>
      </section>
      <section className="px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl border border-[#E53935] bg-[#121A2E] p-6">
          <h2 className="text-2xl font-semibold">Need more than scripts?</h2>
          <p className="mt-3 text-sm text-[#94A3B8]">Explore OperatorOS tools for entitlement-gated automation, technician operations, and premium MSP workflows.</p>
          <a className="mt-5 inline-block border border-[#E53935] bg-[#E53935] px-4 py-2 text-sm font-semibold text-white" href="/scripts/operatoros">Explore OperatorOS Tools</a>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#24304A] bg-[#121A2E] p-5">
      <p className="text-3xl font-semibold text-[#F8FAFC]">{value}</p>
      <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[#94A3B8]">{label}</p>
    </div>
  );
}
