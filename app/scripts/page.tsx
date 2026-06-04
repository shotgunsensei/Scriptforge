import { getCatalogFacets, listPublicScripts } from "../../lib/scripts/catalog";
import { ScriptsShell } from "./components";
import { parseScriptFilters, type SearchParamsInput } from "./page-utils";

export const dynamic = "force-dynamic";

export default async function ScriptsPage({ searchParams }: { searchParams: SearchParamsInput }) {
  const { filterState, catalogFilters } = await parseScriptFilters(searchParams);
  const [scripts, facets] = await Promise.all([listPublicScripts(catalogFilters), getCatalogFacets()]);

  return (
    <ScriptsShell
      description="Browse approved OperatorOS and community PowerShell automation with safety metadata, execution context, and review status visible before use."
      facets={facets}
      filters={filterState}
      scripts={scripts}
      title="Script Library"
    />
  );
}
