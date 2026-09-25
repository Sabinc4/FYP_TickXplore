import { useState, type ReactNode } from "react";
import {
  FaLocationArrow,
  FaMapMarkerAlt,
  FaSearch,
  FaStar,
} from "react-icons/fa";
import { AMENITIES, formatPrice, type AccommodationType } from "../data/accommodations";
import type { AccommodationFilters } from "../utils/accommodationFilters";

interface AccommodationFiltersProps {
  filters: AccommodationFilters;
  bounds: { min: number; max: number };
  availableCities: string[];
  onChange: (filters: AccommodationFilters) => void;
  onApply: () => void;
  onClear: () => void;
}

const TYPES: { label: string; value: AccommodationType }[] = [
  { label: "Hotels", value: "Hotel" },
  { label: "Villas", value: "Villa" },
  { label: "Private Rooms", value: "Private Room" },
  { label: "Apartments", value: "Apartment" },
  { label: "Guest Houses", value: "Guest House" },
];

const RATING_OPTIONS = [
  { value: 5, label: "5★ and above" },
  { value: 4, label: "4★ and above" },
  { value: 3, label: "3★ and above" },
];

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="border-b border-slate-100 px-5 py-4 last:border-b-0">
    <h3 className="mb-3 text-sm font-bold text-slate-900">{title}</h3>
    {children}
  </div>
);

const Checkbox = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) => (
  <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-slate-600 transition-colors hover:text-slate-900">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-slate-300 accent-blue-600"
    />
    {label}
  </label>
);

const AccommodationFilters = ({
  filters,
  bounds,
  availableCities,
  onChange,
  onApply,
  onClear,
}: AccommodationFiltersProps) => {
  const [geoError, setGeoError] = useState("");

  const range = bounds.max - bounds.min || 1;
  const minPct = ((filters.priceMin - bounds.min) / range) * 100;
  const maxPct = ((filters.priceMax - bounds.min) / range) * 100;

  const set = (patch: Partial<AccommodationFilters>) => onChange({ ...filters, ...patch });

  const toggleListValue = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const handleNearMe = () => {
    setGeoError("");
    if (filters.nearMe) {
      set({ nearMe: false });
      return;
    }
    if (!("geolocation" in navigator)) {
      setGeoError("Location is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => set({ nearMe: true }),
      () =>
        setGeoError(
          "Location access denied — results will use sample distances only."
        )
    );
  };

  const filteredCities = availableCities.filter((c) =>
    c.toLowerCase().includes(filters.locationQuery.trim().toLowerCase())
  );

  return (
    <div className="flex flex-col">
      {/* A. Location */}
      <Section title="Location">
        <div className="relative mb-3">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
          <input
            type="text"
            value={filters.locationQuery}
            onChange={(e) => set({ locationQuery: e.target.value })}
            placeholder="Search areas…"
            className="w-full rounded-xl border border-slate-200 bg-[#F0F7FF] py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
          />
        </div>

        <button
          type="button"
          onClick={handleNearMe}
          className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
            filters.nearMe
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
          }`}
        >
          <FaLocationArrow className="text-xs" />
          Near me
        </button>
        {geoError && (
          <p className="mt-2 text-xs leading-relaxed text-amber-600">{geoError}</p>
        )}

        <div className="mt-3 max-h-36 space-y-2 overflow-y-auto pr-1">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <Checkbox
                key={city}
                label={city}
                checked={filters.locations.includes(city)}
                onChange={() => set({ locations: toggleListValue(filters.locations, city) })}
              />
            ))
          ) : (
            <p className="text-xs text-slate-400">No matching areas.</p>
          )}
        </div>
      </Section>

      {/* B. Accommodation type */}
      <Section title="Accommodation Type">
        <div className="space-y-2">
          <Checkbox
            label="All Stays"
            checked={filters.types.length === 0}
            onChange={() => set({ types: [] })}
          />
          {TYPES.map(({ label, value }) => (
            <Checkbox
              key={value}
              label={label}
              checked={filters.types.includes(value)}
              onChange={() => set({ types: toggleListValue(filters.types, value) })}
            />
          ))}
        </div>
      </Section>

      {/* C. Price range */}
      <Section title="Price Range">
        <div className="mb-3 flex items-center gap-2">
          <input
            type="number"
            min={bounds.min}
            max={filters.priceMax}
            value={filters.priceMin}
            onChange={(e) => set({ priceMin: Math.min(Number(e.target.value) || bounds.min, filters.priceMax) })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            aria-label="Minimum price"
          />
          <span className="text-slate-400">–</span>
          <input
            type="number"
            min={filters.priceMin}
            max={bounds.max}
            value={filters.priceMax}
            onChange={(e) => set({ priceMax: Math.max(Number(e.target.value) || bounds.max, filters.priceMin) })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            aria-label="Maximum price"
          />
        </div>

        <div className="dual-range relative h-5">
          <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-slate-200" />
          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-blue-500"
            style={{ left: `${minPct}%`, width: `${Math.max(maxPct - minPct, 0.5)}%` }}
          />
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={500}
            value={filters.priceMin}
            aria-label="Minimum price slider"
            onChange={(e) =>
              set({ priceMin: Math.min(Number(e.target.value), filters.priceMax) })
            }
            style={{ zIndex: filters.priceMin > (bounds.min + bounds.max) / 2 ? 4 : 5 }}
          />
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={500}
            value={filters.priceMax}
            aria-label="Maximum price slider"
            onChange={(e) =>
              set({ priceMax: Math.max(Number(e.target.value), filters.priceMin) })
            }
            style={{ zIndex: filters.priceMin > (bounds.min + bounds.max) / 2 ? 5 : 4 }}
          />
        </div>

        <p className="mt-2 text-xs font-semibold text-slate-600">
          {formatPrice(filters.priceMin)} – {formatPrice(filters.priceMax)}
        </p>
      </Section>

      {/* D. Guest rating */}
      <Section title="Guest Rating">
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
            <input
              type="radio"
              name="rating"
              checked={filters.rating === 0}
              onChange={() => set({ rating: 0 })}
              className="accent-blue-600"
            />
            Any rating
          </label>
          {RATING_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === value}
                onChange={() => set({ rating: value })}
                className="accent-blue-600"
              />
              <span className="flex items-center gap-1">
                {label}
                <FaStar className="text-amber-400" />
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* E. Amenities */}
      <Section title="Amenities">
        <div className="space-y-2">
          {AMENITIES.map((am) => (
            <Checkbox
              key={am}
              label={am}
              checked={filters.amenities.includes(am)}
              onChange={() =>
                set({ amenities: toggleListValue(filters.amenities, am) })
              }
            />
          ))}
        </div>
      </Section>

      {/* F. Availability */}
      <Section title="Availability">
        <label className="flex cursor-pointer select-none items-center justify-between text-sm text-slate-600">
          Available now
          <span
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              filters.availableNow ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <input
              type="checkbox"
              className="peer sr-only"
              checked={filters.availableNow}
              onChange={(e) => set({ availableNow: e.target.checked })}
            />
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                filters.availableNow ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </span>
        </label>

        <div className="mt-3 grid grid-cols-1 gap-2">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <FaMapMarkerAlt className="text-xs text-slate-400" />
            <input
              type="date"
              value={filters.checkIn ?? ""}
              onChange={(e) => set({ checkIn: e.target.value })}
              className="w-full bg-transparent text-sm text-slate-700 focus:outline-none"
              aria-label="Check-in date"
            />
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <FaMapMarkerAlt className="text-xs text-slate-400" />
            <input
              type="date"
              value={filters.checkOut ?? ""}
              onChange={(e) => set({ checkOut: e.target.value })}
              className="w-full bg-transparent text-sm text-slate-700 focus:outline-none"
              aria-label="Check-out date"
            />
          </label>
        </div>
      </Section>

      {/* Actions */}
      <div className="space-y-2 p-5">
        <button
          type="button"
          onClick={onApply}
          className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={onClear}
          className="w-full rounded-xl px-5 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default AccommodationFilters;