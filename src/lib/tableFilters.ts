import { useState } from "react";

/** Sentinel value meaning "no filter applied". */
export const ALL_FILTER = "all";

export interface TableFilterOption {
  value: string;
  label: string;
}

export interface TableFilter {
  /** Current value — `ALL_FILTER` means everything is shown. */
  value: string;
  onChange: (value: string) => void;
  /** Label of the "no filter" option. */
  allLabel: string;
  options: TableFilterOption[];
}

/** Build filter options from raw values (deduplicated, sorted, lowercase keys). */
export const toFilterOptions = (
  values: (string | null | undefined)[],
): TableFilterOption[] =>
  Array.from(
    new Set(
      values
        .filter((v): v is string => !!v && v.trim() !== "")
        .map((v) => v.trim()),
    ),
  )
    .sort((a, b) => a.localeCompare(b))
    .map((label) => ({ value: label.toLowerCase(), label }));

/**
 * Pagination state that reads as page 1 whenever `key` (the active search /
 * filters) changes, and remembers the page again once the user navigates.
 * Purely derived — no effects, no render-phase updates.
 */
export function useResettablePage(
  key: string,
): [number, (page: number) => void] {
  const [state, setState] = useState({ key, page: 1 });
  const currentPage = state.key === key ? state.page : 1;
  const setCurrentPage = (page: number) => setState({ key, page });
  return [currentPage, setCurrentPage];
}
