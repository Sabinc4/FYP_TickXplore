import { FaListUl, FaThLarge } from "react-icons/fa";
import type { SortOption } from "../utils/accommodationFilters";
import { SORT_OPTIONS } from "../utils/accommodationFilters";

interface ResultsToolbarProps {
  count: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

const ResultsToolbar = ({
  count,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
}: ResultsToolbarProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-card">
    <p className="pl-1 text-sm text-slate-500">
      Showing <span className="font-bold text-slate-900">{count}</span>{" "}
      {count === 1 ? "accommodation" : "accommodations"}
    </p>

    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 text-sm text-slate-500">
        Sort by
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5">
        <button
          type="button"
          aria-label="Grid view"
          aria-pressed={viewMode === "grid"}
          onClick={() => onViewModeChange("grid")}
          className={`flex h-8 w-9 items-center justify-center rounded-[10px] text-sm transition ${
            viewMode === "grid"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <FaThLarge />
        </button>
        <button
          type="button"
          aria-label="List view"
          aria-pressed={viewMode === "list"}
          onClick={() => onViewModeChange("list")}
          className={`flex h-8 w-9 items-center justify-center rounded-[10px] text-sm transition ${
            viewMode === "list"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <FaListUl />
        </button>
      </div>
    </div>
  </div>
);

export default ResultsToolbar;