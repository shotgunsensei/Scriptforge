import type { PublicCatalogSource, PublicSourceFilter, ScriptCatalogFilters } from "../../lib/scripts/catalog";
import type { ScriptFilterState } from "./components";

export type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

export async function parseScriptFilters(
  searchParams: SearchParamsInput,
  source?: PublicCatalogSource,
  category?: string,
): Promise<{ filterState: ScriptFilterState; catalogFilters: ScriptCatalogFilters }> {
  const params = await searchParams;
  const filterState: ScriptFilterState = {
    q: readParam(params.q),
    category: category ?? readParam(params.category),
    tag: readParam(params.tag),
    risk: readParam(params.risk),
    execution: readParam(params.execution),
    admin: readParam(params.admin),
    source: source ?? readParam(params.source),
  };

  return {
    filterState,
    catalogFilters: {
      search: filterState.q,
      category: filterState.category,
      tag: filterState.tag,
      risk: filterState.risk,
      executionType: filterState.execution,
      requiresAdmin:
        filterState.admin === "true" ? true : filterState.admin === "false" ? false : undefined,
      source: (source ?? filterState.source ?? "all") as PublicSourceFilter,
    },
  };
}

function readParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
