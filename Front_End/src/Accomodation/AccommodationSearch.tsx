import { type FormEvent } from "react";
import { FaMapMarkerAlt, FaSearch, FaUserFriends } from "react-icons/fa";

interface AccommodationSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  checkIn: string;
  checkOut: string;
  onDatesChange: (dates: { checkIn: string; checkOut: string }) => void;
  guests: number;
  onGuestsChange: (n: number) => void;
  onSearch: () => void;
}

const fieldClass =
  "w-full rounded-xl bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40";

const AccommodationSearch = ({
  query,
  onQueryChange,
  checkIn,
  checkOut,
  onDatesChange,
  guests,
  onGuestsChange,
  onSearch,
}: AccommodationSearchProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-7 max-w-4xl rounded-2xl border border-blue-100 bg-white/85 p-3 shadow-card-lg backdrop-blur"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_0.9fr_auto]">
        <label className="group relative">
          <span className="sr-only">Location</span>
          <FaMapMarkerAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-blue-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="City, neighborhood or stay name"
            className={fieldClass}
          />
        </label>

        <label className="relative">
          <span className="sr-only">Check-in date</span>
          <input
            type="date"
            value={checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              onDatesChange({ checkIn: e.target.value, checkOut })
            }
            className={`${fieldClass} text-slate-500`}
          />
        </label>

        <label className="relative">
          <span className="sr-only">Check-out date</span>
          <input
            type="date"
            value={checkOut}
            min={checkIn || new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              onDatesChange({ checkIn, checkOut: e.target.value })
            }
            className={`${fieldClass} text-slate-500`}
          />
        </label>

        <label className="relative">
          <span className="sr-only">Guests</span>
          <FaUserFriends className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
          <input
            type="number"
            min={1}
            max={20}
            value={guests}
            onChange={(e) =>
              onGuestsChange(
                Math.max(1, Math.min(20, Number(e.target.value) || 1))
              )
            }
            className={fieldClass}
            aria-label="Guests"
          />
        </label>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
        >
          <FaSearch />
          Search
        </button>
      </div>
    </form>
  );
};

export default AccommodationSearch;