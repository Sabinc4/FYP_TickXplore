import type { Accommodation, AccommodationType } from "../data/accommodations";

export interface AccommodationFilters {
  /** free-text query typed into the "locations / areas" filter input */
  locationQuery: string;
  /** selected cities/areas */
  locations: string[];
  /** selected accommodation types (empty = all types) */
  types: AccommodationType[];
  priceMin: number;
  priceMax: number;
  /** minimum guest rating (0 = any) */
  rating: number;
  amenities: string[];
  availableNow: boolean;
  /** check-in / check-out dates used for the "Availability" filters */
  checkIn: string;
  checkOut: string;
  /** sorted nearest-first when enabled (uses sample distances) */
  nearMe: boolean;
}

export type SortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "popular";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
];

/** Derive a sensible default price range from the data's actual bounds. */
export const getPriceBounds = (list: Accommodation[]) => {
  const prices = list.map((a) => a.pricePerNight);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return {
    min: Math.floor(min / 500) * 500, // round down to nearest 500
    max: Math.ceil(max / 1000) * 1000, // round up to nearest 1000
  };
};

export const createDefaultFilters = (list: Accommodation[]): AccommodationFilters => {
  const bounds = getPriceBounds(list);
  return {
    locationQuery: "",
    locations: [],
    types: [],
    priceMin: bounds.min,
    priceMax: bounds.max,
    rating: 0,
    amenities: [],
    availableNow: false,
    checkIn: "",
    checkOut: "",
    nearMe: false,
  };
};

/** Search by name, city, neighborhood, address or type. */
export const applySearch = (list: Accommodation[], query: string): Accommodation[] => {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((a) =>
    [a.name, a.city, a.neighborhood, a.address, a.type]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
};

/** Apply every active filter to a list of accommodations. */
export const applyFilters = (
  list: Accommodation[],
  f: AccommodationFilters
): Accommodation[] =>
  list.filter((a) => {
    if (f.locations.length > 0 && !f.locations.includes(a.city)) return false;
    if (f.types.length > 0 && !f.types.includes(a.type)) return false;
    if (a.pricePerNight < f.priceMin || a.pricePerNight > f.priceMax) return false;
    if (f.rating > 0 && a.rating < f.rating) return false;
    if (f.amenities.length > 0 && !f.amenities.every((am) => a.amenities.includes(am)))
      return false;
    if (f.availableNow && !a.availableNow) return false;
    return true;
  });

/** Sort the result list based on the active option / "near me" mode. */
export const applySort = (
  list: Accommodation[],
  sort: SortOption,
  nearMe: boolean
): Accommodation[] => {
  const sorted = [...list];
  if (nearMe) {
    return sorted.sort((a, b) => a.distanceKm - b.distanceKm);
  }
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
    case "price-desc":
      return sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
    case "rating":
      return sorted.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount
      );
    case "popular":
      return sorted.sort((a, b) => b.popularityScore - a.popularityScore);
    case "recommended":
    default:
      return sorted.sort(
        (a, b) =>
          b.popularityScore - a.popularityScore || b.rating - a.rating
      );
  }
};

/** Distinct cities present in the loaded data (for the area checklist). */
export const allCities = (list: Accommodation[]): string[] =>
  Array.from(new Set(list.map((a) => a.city))).sort();