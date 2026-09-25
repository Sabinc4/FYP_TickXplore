import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaStar,
} from "react-icons/fa";
import SmartImage from "../Component/SmartImage";
import {
  ACCOMMODATIONS,
  formatPrice,
  type Accommodation,
} from "../data/accommodations";

const AccommodationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState(0);

  const accommodation: Accommodation | undefined = ACCOMMODATIONS.find(
    (a) => a.id === id
  );

  if (!accommodation) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Stay not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The accommodation you are looking for does not exist.
        </p>
        <Link
          to="/stay"
          className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          ← Back to stays
        </Link>
      </div>
    );
  }

  const acc = accommodation;
  const gallery = acc.gallery.length > 0 ? acc.gallery : [acc.image];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <Link
        to="/stay"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
      >
        <FaArrowLeft /> Back to stays
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-card">
            <SmartImage
              src={gallery[activeImage]}
              alt={acc.name}
              className="aspect-[16/10] h-auto w-full object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`overflow-hidden rounded-xl border-2 transition ${
                    idx === activeImage
                      ? "border-blue-600"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <SmartImage
                    src={src}
                    alt={`${acc.name} — gallery ${idx + 1}`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                {acc.type} · Sample listing
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {acc.name}
              </h1>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
              <FaStar className="text-amber-400" />
              {acc.rating.toFixed(1)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-blue-500" />
              {acc.address}
            </span>
            <span>{acc.distanceKm.toFixed(1)} km away*</span>
            <span>
              <strong className="text-slate-700">{acc.reviewCount}</strong>{" "}
              reviews
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-slate-600">
            {acc.description}
          </p>

          <h2 className="mt-6 text-sm font-bold uppercase tracking-wide text-slate-900">
            Amenities
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {acc.amenities.map((am) => (
              <span
                key={am}
                className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
              >
                <FaCheckCircle className="text-blue-500" />
                {am}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-[#F0F7FF] p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {formatPrice(acc.pricePerNight)}
                  <span className="text-sm font-medium text-slate-500">
                    {" "}
                    / night
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {acc.availableNow
                    ? "Available now — sample availability"
                    : "Currently unavailable — sample data"}
                </p>
              </div>
              <button
                type="button"
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
              >
                Book This Stay
              </button>
            </div>
            <p className="mt-3 border-t border-blue-100 pt-3 text-xs text-slate-500">
              This is a sample listing for preview purposes. No real booking
              or payment will be processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetails;