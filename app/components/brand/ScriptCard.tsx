import Link from "next/link";
import type { PublicScriptCatalogItem } from "../../../lib/scripts/catalog";
import { getScriptDetailHref } from "../../../lib/scripts/catalog";
import { CommunityBadge } from "./CommunityBadge";
import { OfficialBadge } from "./OfficialBadge";
import { RiskBadge } from "./RiskBadge";

export function BrandScriptCard({ script }: { script: PublicScriptCatalogItem }) {
  const official = script.source === "operatoros";

  return (
    <article className={`border p-5 transition hover:-translate-y-0.5 ${official ? "border-[#E53935]/70 bg-[#121A2E] shadow-lg shadow-[#E53935]/10" : "border-[#5E81F4]/60 bg-[#121A2E]"}`}>
      <div className="flex flex-wrap gap-2">
        {official ? <OfficialBadge /> : <CommunityBadge reviewed={script.submission.review_status === "approved"} />}
        <RiskBadge risk={script.submission.safety.risk_level} />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#94A3B8]">{script.category}</p>
      <h3 className="mt-2 text-lg font-semibold text-[#F8FAFC]">{script.submission.title}</h3>
      <p className="mt-3 min-h-12 text-sm leading-6 text-[#94A3B8]">{script.submission.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#94A3B8]">
        <span className="border border-[#24304A] px-2 py-1">{script.execution_type}</span>
        <span className="border border-[#24304A] px-2 py-1">{script.submission.safety.requires_admin ? "Admin" : "Read Only"}</span>
      </div>
      <Link className="mt-5 inline-block border border-[#E53935] bg-[#E53935] px-4 py-2 text-sm font-semibold text-white" href={getScriptDetailHref(script)}>
        View
      </Link>
    </article>
  );
}
