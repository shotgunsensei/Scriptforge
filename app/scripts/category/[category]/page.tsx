import type { Metadata } from "next";
import { getCatalogFacets, listPublicScripts } from "../../../../lib/scripts/catalog";
import { ScriptsShell } from "../../components";
import { parseScriptFilters, type SearchParamsInput } from "../../page-utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const title = `${category} PowerShell Scripts | OperatorOS ScriptForge`;

  return {
    title,
    description: `Browse approved ${category} PowerShell automation from official OperatorOS and reviewed community sources.`,
    alternates: {
      canonical: `/scripts/category/${category}`,
    },
  };
}

export default async function CategoryScriptsPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: SearchParamsInput;
}) {
  const { category } = await params;
  const { filterState, catalogFilters } = await parseScriptFilters(searchParams, undefined, category);
  const [scripts, facets] = await Promise.all([listPublicScripts(catalogFilters), getCatalogFacets()]);

  return (
    <ScriptsShell
      description={`Approved scripts in the ${category} category across official OperatorOS and reviewed community sources.`}
      facets={facets}
      filters={filterState}
      scripts={scripts}
      title={`${category} Scripts`}
    />
  );
}
