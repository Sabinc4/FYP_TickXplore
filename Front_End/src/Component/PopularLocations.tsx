import { FaMapMarkerAlt } from "react-icons/fa";
import { POPULAR_LOCATIONS } from "../data/accommodations";
import SmartImage from "./SmartImage";

interface PopularLocationsProps {
  onSelect: (city: string) => void;
}

const PopularLocations = ({ onSelect }: PopularLocationsProps) => (
  <section aria-label="Explore popular locations" className="py-12 md:py-16">
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="section-eyebrow">Where to stay</span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Explore Popular Locations
          </h2>
        </div>
        <p className="max-w-sm text-sm text-slate-500">
          Jump straight to the accommodations in a favorite city.
        </p>
      </div>

      <div className="no-scrollbar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8">
        {POPULAR_LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            type="button"
            onClick={() => onSelect(loc.name)}
            className="group w-64 shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-100 bg-white text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg"
          >
            <div className="relative h-40 overflow-hidden">
              <SmartImage
                src={loc.image}
                alt={loc.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-900 backdrop-blur">
                {loc.staysCount} {loc.staysCount === 1 ? "stay" : "stays"}
              </span>
            </div>
            <div className="p-4">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <FaMapMarkerAlt className="text-blue-500" />
                {loc.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{loc.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  </section>
);

export default PopularLocations;