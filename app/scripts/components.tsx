import Link from "next/link";
import {
  SCRIPT_PACKS,
  type PublicCatalogSource,
  type PublicScriptCatalogItem,
} from "../../lib/scripts/catalog";
import { BrandScriptCard } from "../components/brand/ScriptCard";
import { SearchBar } from "../components/brand/SearchBar";

export type ScriptFilterState = {
  q?: string;
  category?: string;
  tag?: string;
  risk?: string;
  execution?: string;
  admin?: string;
  source?: string;
};

type Facets = {
  categories: string[];
  tags: string[];
  risks: string[];
  executionTypes: string[];
};

export function ScriptsShell({
  title,
  description,
  scripts,
  facets,
  filters,
  lockedSource,
}: {
  title: string;
  description: string;
  scripts: PublicScriptCatalogItem[];
  facets: Facets;
  filters: ScriptFilterState;
  lockedSource?: PublicCatalogSource;
}) {
  return (
    <main className="min-h-screen px-5 py-6 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="border-b border-[#24304A] pb-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5E81F4]">OperatorOS ScriptForge</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#F8FAFC] md:text-4xl">{title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#94A3B8]">{description}</p>
            </div>
            <nav className="flex flex-wrap gap-2 text-sm">
              <NavButton href="/scripts" label="All" />
              <NavButton href="/scripts/operatoros" label="OperatorOS" />
              <NavButton href="/scripts/community" label="Community" />
            </nav>
          </div>
        </header>

        <ScriptFilters facets={facets} filters={filters} lockedSource={lockedSource} />

        <section className="border border-[#24304A] bg-[#121A2E] p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#F8FAFC]">Generated Script Packs</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Download category bundles generated from approved official OperatorOS scripts.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SCRIPT_PACKS.map((pack) => (
                <a
                  className="border border-[#24304A] bg-[#0B1020] px-3 py-2 text-sm font-semibold text-[#F8FAFC] hover:border-[#E53935]"
                  download
                  href={`/api/scripts/packs/${pack.slug}`}
                  key={pack.slug}
                >
                  {pack.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {scripts.length === 0 ? (
            <div className="border border-[#24304A] bg-[#121A2E] p-5 text-sm text-[#94A3B8] md:col-span-2 xl:col-span-3">
              <img alt="" className="mb-4 h-28 w-auto" src="/illustrations/empty-state.svg" />
              No approved scripts match the current filters.
            </div>
          ) : (
            scripts.map((script) => <BrandScriptCard key={`${script.source}:${script.slug}`} script={script} />)
          )}
        </section>
      </div>
    </main>
  );
}

export function ScriptFilters({
  facets,
  filters,
  lockedSource,
}: {
  facets: Facets;
  filters: ScriptFilterState;
  lockedSource?: PublicCatalogSource;
}) {
  return (
    <form className="grid gap-3 border border-[#24304A] bg-[#121A2E] p-4 md:grid-cols-2 xl:grid-cols-7">
      <div className="xl:col-span-2">
        <SearchBar defaultValue={filters.q ?? ""} />
      </div>
      <Select label="Category" name="category" value={filters.category} options={facets.categories} />
      <Select label="Tag" name="tag" value={filters.tag} options={facets.tags} />
      <Select label="Risk" name="risk" value={filters.risk} options={facets.risks} />
      <Select label="Execution" name="execution" value={filters.execution} options={facets.executionTypes} />
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
        Admin
        <select
          className="border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-400"
          defaultValue={filters.admin ?? ""}
          name="admin"
        >
          <option value="">Any</option>
          <option value="true">Requires admin</option>
          <option value="false">No admin</option>
        </select>
      </label>
      {!lockedSource ? (
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
          Source
          <select
            className="border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-400"
            defaultValue={filters.source ?? ""}
            name="source"
          >
            <option value="">All</option>
            <option value="official">Official</option>
            <option value="operatoros">OperatorOS</option>
            <option value="community">Community</option>
          </select>
        </label>
      ) : null}
      <div className="flex items-end gap-2">
        <button className="border border-rose-500 bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500">
          Apply
        </button>
        <Link className="border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200" href={lockedSource ? `/scripts/${lockedSource}` : "/scripts"}>
          Reset
        </Link>
      </div>
    </form>
  );
}

function NavButton({ href, label }: { href: string; label: string }) {
  return (
    <Link className="border border-[#24304A] bg-[#121A2E] px-3 py-2 text-[#F8FAFC] hover:border-[#E53935]" href={href}>
      {label}
    </Link>
  );
}

function Select({ label, name, value, options }: { label: string; name: string; value?: string; options: string[] }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[#F8FAFC]">
      {label}
      <select
        className="border border-[#24304A] bg-[#0B1020] px-3 py-2 text-[#F8FAFC] outline-none focus:border-[#5E81F4]"
        defaultValue={value ?? ""}
        name={name}
      >
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-slate-800 bg-slate-900/70 p-2">
      <p className="text-[0.65rem] uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-white">{value}</p>
    </div>
  );
}
