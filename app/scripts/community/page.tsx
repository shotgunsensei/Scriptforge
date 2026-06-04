import { getCatalogFacets, listPublicScripts } from "../../../lib/scripts/catalog";
import { ScriptsShell } from "../components";
import { parseScriptFilters, type SearchParamsInput } from "../page-utils";

export const dynamic = "force-dynamic";

export default async function CommunityScriptsPage({ searchParams }: { searchParams: SearchParamsInput }) {
  const { filterState, catalogFilters } = await parseScriptFilters(searchParams, "community");
  const [scripts, facets] = await Promise.all([listPublicScripts(catalogFilters), getCatalogFacets()]);

  return (
    <ScriptsShell
      description="Approved community scripts reviewed for ScriptForge visibility but kept separate from official OperatorOS automation."
      facets={facets}
      filters={filterState}
      lockedSource="community"
      scripts={scripts}
      title="Community Scripts"
    />
  );
}
