import type { Metadata } from "next";
import { getCatalogFacets, listPublicScripts } from "../../../lib/scripts/catalog";
import { ScriptsShell } from "../components";
import { parseScriptFilters, type SearchParamsInput } from "../page-utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Official OperatorOS PowerShell Scripts | ScriptForge",
  description:
    "Browse verified OperatorOS PowerShell scripts for MSP automation, Microsoft 365 audits, security checks, and technician workflows.",
  alternates: {
    canonical: "/scripts/operatoros",
  },
};

export default async function OperatorOSScriptsPage({ searchParams }: { searchParams: SearchParamsInput }) {
  const { filterState, catalogFilters } = await parseScriptFilters(searchParams, "operatoros");
  const [scripts, facets] = await Promise.all([listPublicScripts(catalogFilters), getCatalogFacets()]);

  return (
    <ScriptsShell
      description="Official OperatorOS scripts promoted for trusted catalog placement and technician use."
      facets={facets}
      filters={filterState}
      lockedSource="operatoros"
      scripts={scripts}
      title="OperatorOS Scripts"
    />
  );
}
