import { useState, type ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  FaCheckCircle,
  FaCoffee,
  FaHeart,
  FaMapMarkerAlt,
  FaMountain,
  FaParking,
  FaPaw,
  FaRegHeart,
  FaSnowflake,
  FaStar,
  FaSwimmingPool,
  FaUtensils,
  FaWifi,
} from "react-icons/fa";
import type { Accommodation } from "../data/accommodations";
import { formatPrice } from "../data/accommodations";
import SmartImage from "../Component/SmartImage";

const AMENITY_ICONS: Record<string, IconType> = {
  "Free Wi-Fi": FaWifi,
  "Swimming Pool": FaSwimmingPool,
  "Air Conditioning": FaSnowflake,
  Parking: FaParking,
  "Breakfast Included": FaCoffee,
  "Pet Friendly": FaPaw,
  "Mountain View": FaMountain,
  Kitchen: FaUtensils,
};

const BADGE_STYLES: Record<string, string> = {
  Popular: "bg-blue-600 text-white",
  Featured: "bg-indigo-500 text-white",
  "Great Value": "bg-emerald-500 text-white",
  New: "bg-amber-500 text-white",
};

interface AccommodationCardProps {
  accommodation: Accommodation;
  nights: number;
  layout: "grid" | "list";
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const AccommodationCard = ({
  accommodation: acc,
  nights,
  layout,
  isFavorite,
  onToggleFavorite,
}: AccommodationCardProps) => {
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);

  const gallery = acc.gallery.length > 0 ? acc.gallery : [acc.image];
  const total = nights > 0 ? nights * acc.pricePerNight : 0;

  const openDetails = () => navigate(`/stay/${acc.id}`);

  const imageArea = (
    <div className="relative overflow-hidden bg-blue-50">
      <button
        type="button"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(acc.id);
        }}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow-md backdrop-blur transition-transform hover:scale-110"
      >
        {isFavorite ? (
          <FaHeart className="text-rose-500" />
        ) : (
          <FaRegHeart className="text-slate-500" />
        )}
      </button>

      {acc.badge && (
        <span
          className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ${
            BADGE_STYLES[acc.badge] ?? "bg-blue-600 text-white"
          }`}
        >
          {acc.badge}
        </span>
      )}

      <SmartImage
        src={gallery[activeImage]}
        alt={acc.name}
        className={`w-full object-cover ${
          layout === "grid"
            ? "aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
            : "aspect-[16/10] md:aspect-auto md:h-full"
        }`}
      />

      {gallery.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
          {gallery.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`View image ${idx + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveImage(idx);
              }}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeImage ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white/90"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );

  const infoArea = (
    <div className="flex flex-1 flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-slate-900">{acc.name}</h3>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-blue-600">
            {acc.type}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
          <FaStar className="text-amber-400" />
          {acc.rating.toFixed(1)}
          <span className="font-normal text-slate-400">({acc.reviewCount})</span>
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-blue-500" />
          {acc.city} · {acc.neighborhood}
        </span>
        <span className="hidden sm:inline">{acc.distanceKm.toFixed(1)} km away*</span>
      </div>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
        {acc.description}
      </p>

      {acc.amenities.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {acc.amenities.slice(0, 4).map((am) => {
            const Icon: ComponentType<{ className?: string }> = AMENITY_ICONS[am] ?? FaCheckCircle;
            return (
              <span
                key={am}
                title={am}
                className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700"
              >
                <Icon className="text-xs" />
                {am}
              </span>
            );
          })}
          {acc.amenities.length > 4 && (
            <span className="flex items-center text-[11px] font-medium text-slate-400">
              +{acc.amenities.length - 4}
            </span>
          )}
        </div>
      )}

      <div
        className={`mt-auto flex items-end justify-between gap-3 pt-4 ${
          layout === "grid" ? "border-t border-slate-100" : ""
        }`}
      >
        <div>
          <div className="text-lg font-extrabold text-slate-900">
            {formatPrice(acc.pricePerNight)}
            <span className="text-xs font-medium text-slate-400"> / night</span>
          </div>
          {total > 0 && (
            <div className="mt-0.5 text-xs font-medium text-emerald-600">
              {formatPrice(total)} for {nights} {nights === 1 ? "night" : "nights"}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={openDetails}
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
        >
          View Details
        </button>
      </div>
    </div>
  );

  if (layout === "list") {
    return (
      <article
        onClick={openDetails}
        className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg md:flex-row"
      >
        <div className="md:w-72 md:shrink-0">{imageArea}</div>
        {infoArea}
      </article>
    );
  }

  return (
    <article
      onClick={openDetails}
      className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg"
    >
      {imageArea}
      {infoArea}
    </article>
  );
};

export default AccommodationCard;