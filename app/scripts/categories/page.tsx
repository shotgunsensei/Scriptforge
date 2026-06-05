import type { Metadata } from "next";
import { CategoryCard } from "../../components/brand/CategoryCard";
import { getCatalogFacets } from "../../../lib/scripts/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Script Categories | OperatorOS ScriptForge",
  description: "Browse OperatorOS ScriptForge PowerShell scripts by category.",
};

const iconByCategory: Record<string, string> = {
  "active-directory": "/icons/active-directory.svg",
  "entra-id": "/icons/entra-id.svg",
  "exchange-online": "/icons/exchange.svg",
  "kaseya-datto-rmm": "/icons/datto-rmm.svg",
  "microsoft-365": "/icons/microsoft-365.svg",
  networking: "/icons/networking.svg",
  security: "/icons/security.svg",
  "windows-server": "/icons/windows-server.svg",
  "workstation-repair": "/icons/powershell-utilities.svg",
};

export default async function ScriptCategoriesPage() {
  const facets = await getCatalogFacets();

  return (
    <main className="min-h-screen px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-[#24304A] pb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5E81F4]">OperatorOS ScriptForge</p>
          <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Script Categories</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#94A3B8]">
            Jump directly into a parent script category without relying on browser history.
          </p>
        </header>
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facets.categories.map((category) => (
            <CategoryCard
              href={`/scripts/category/${category}`}
              icon={iconByCategory[category] ?? "/icons/powershell-utilities.svg"}
              key={category}
              title={humanize(category)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}

function humanize(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
