import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSlidersH, FaTimes } from "react-icons/fa";
import AccommodationFilters from "../Accomodation/AccommodationFilters";
import AccommodationHero from "../Accomodation/AccommodationHero";
import AccommodationResults from "../Accomodation/AccommodationResults";
import AccommodationSearch from "../Accomodation/AccommodationSearch";
import PopularLocations from "../Component/PopularLocations";
import { ACCOMMODATIONS, nightsBetween } from "../data/accommodations";
import {
  allCities,
  applyFilters,
  applySearch,
  applySort,
  createDefaultFilters,
  getPriceBounds,
  type AccommodationFilters as FiltersState,
  type SortOption,
} from "../utils/accommodationFilters";

const FAVORITES_KEY = "stayFavorites";

const loadFavorites = (): Set<string> => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set<string>();
  }
};

const AccommodationPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [guests, setGuests] = useState(2);
  const [filters, setFilters] = useState<FiltersState>(() =>
    createDefaultFilters(ACCOMMODATIONS)
  );
  const [sort, setSort] = useState<SortOption>("recommended");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  /* keep the nav quick-search box and this page's query in sync */
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null && q !== query) setQuery(q);
  }, [searchParams, query]);

  /* initial "fetch" — swap this with a real API call later */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const bounds = useMemo(() => getPriceBounds(ACCOMMODATIONS), []);
  const cities = useMemo(() => allCities(ACCOMMODATIONS), []);

  const nights = nightsBetween(dates.checkIn, dates.checkOut);

  const results = useMemo(() => {
    let list = applySearch(ACCOMMODATIONS, query);
    list = applyFilters(list, filters);
    return applySort(list, sort, filters.nearMe);
  }, [query, filters, sort]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      } catch {
        /* storage unavailable — ignore */
      }
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setFilters(createDefaultFilters(ACCOMMODATIONS));
    setQuery("");
    setSort("recommended");
    setFiltersOpen(false);
  }, []);

  const applyAndClose = useCallback(() => {
    setFiltersOpen(false);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const selectLocation = useCallback((city: string) => {
    setFilters((prev) => {
      const locations = prev.locations.includes(city)
        ? prev.locations
        : [...prev.locations, city];
      return { ...prev, locations };
    });
    setFiltersOpen(false);
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const handleSearch = useCallback(() => {
    applyAndClose();
  }, [applyAndClose]);

  const changeFilters = useCallback((next: FiltersState) => {
    setFilters(next);
  }, []);

  return (
    <>
      <AccommodationHero>
        <AccommodationSearch
          query={query}
          onQueryChange={setQuery}
          checkIn={dates.checkIn}
          checkOut={dates.checkOut}
          onDatesChange={setDates}
          guests={guests}
          onGuestsChange={setGuests}
          onSearch={handleSearch}
        />
      </AccommodationHero>

      {/* Main discovery layout */}
      <div ref={resultsRef} className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Desktop filter sidebar */}
          <aside className="hidden lg:block">
            <div className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
                <div className="flex items-center justify-between border-b border-slate-100 bg-[#F0F7FF] px-5 py-3.5">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">
                    Filters
                  </h2>
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                    {results.length}
                  </span>
                </div>
                <AccommodationFilters
                  filters={filters}
                  bounds={bounds}
                  availableCities={cities}
                  onChange={changeFilters}
                  onApply={applyAndClose}
                  onClear={clearAll}
                />
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0">
            <AccommodationResults
              accommodations={results}
              loading={loading}
              sort={sort}
              onSortChange={setSort}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              nights={nights}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onClearFilters={clearAll}
              sortedByNearest={filters.nearMe}
            />
          </div>
        </div>
      </div>

      <PopularLocations onSelect={selectLocation} />

      {/* Mobile: floating filter button */}
      <button
        type="button"
        onClick={() => setFiltersOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-card-lg transition hover:bg-blue-700 lg:hidden"
        aria-label="Open filters"
      >
        <FaSlidersH />
        Filters
        {results.length > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600">
            {results.length}
          </span>
        )}
      </button>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[320px] max-w-[85vw] flex-col bg-white shadow-card-lg animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 bg-[#F0F7FF] px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AccommodationFilters
                filters={filters}
                bounds={bounds}
                availableCities={cities}
                onChange={changeFilters}
                onApply={applyAndClose}
                onClear={clearAll}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccommodationPage;