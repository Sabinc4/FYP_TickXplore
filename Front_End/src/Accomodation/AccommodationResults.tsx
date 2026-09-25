import type { Accommodation } from "../data/accommodations";
import type { SortOption } from "../utils/accommodationFilters";
import AccommodationGrid from "./AccommodationGrid";
import EmptyState from "../Component/EmptyState";
import ResultsToolbar from "../Component/ResultsToolbar";

interface AccommodationResultsProps {
  accommodations: Accommodation[];
  loading: boolean;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  nights: number;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onClearFilters: () => void;
  sortedByNearest: boolean;
}

const AccommodationResults = ({
  accommodations,
  loading,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  nights,
  favorites,
  onToggleFavorite,
  onClearFilters,
  sortedByNearest,
}: AccommodationResultsProps) => (
  <section aria-label="Available stays" className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Available Stays Near You
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Explore comfortable stays that match your preferences.
        </p>
      </div>
      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
        Sample listings — preview data
      </span>
    </div>

    {sortedByNearest && !loading && accommodations.length > 0 && (
      <p className="rounded-xl bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700">
        Sorted by approximate distance from your location (sample distances).
      </p>
    )}

    <ResultsToolbar
      count={accommodations.length}
      sort={sort}
      onSortChange={onSortChange}
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
    />

    {!loading && accommodations.length === 0 ? (
      <EmptyState onClearFilters={onClearFilters} />
    ) : (
      <AccommodationGrid
        accommodations={accommodations}
        loading={loading}
        layout={viewMode}
        nights={nights}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
      />
    )}
  </section>
);

export default AccommodationResults;