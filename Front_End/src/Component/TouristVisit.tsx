import { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { homeApi, API_BASE_URL } from "../api";
import type { TouristArea } from "../api/types";

const resolveImage = (image: string) =>
  image.startsWith("http") ? image : `${API_BASE_URL}${image}`;

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#e2e8f0"/><circle cx="200" cy="120" r="34" fill="none" stroke="#64748b" stroke-width="6"/><path d="M120 210 L170 150 L205 190 L230 165 L280 210 Z" fill="#94a3b8"/><text x="200" y="250" font-family="Arial" font-size="16" fill="#64748b" text-anchor="middle">Image unavailable</text></svg>`
  );

const TouristVisit = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [areas, setAreas] = useState<TouristArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTouristAreas = async () => {
      try {
        const data = await homeApi.getTouristAreas();
        setAreas(data);
      } catch (err) {
        console.error("Error fetching tourist areas:", err);
        setError("Failed to load tourist areas. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTouristAreas();
  }, []);

  const scrollCards = (direction: number) => {
    cardRef.current?.scrollBy({ left: direction, behavior: "smooth" });
  };

  const handleCardClick = (area: TouristArea) => {
    const pickup = area.pickupPoint || "Kathmandu";
    const drop = area.dropPoint || area.title;
    const date = new Date().toISOString().split("T")[0];
    navigate(`/tickets?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}&date=${date}`);
  };

  return (
    <section className="mt-10 px-4 md:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl text-center">
        <p className="section-eyebrow">Must Visit</p>
        <h2 className="section-title">Explore Popular Tourist Areas</h2>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Discover Nepal’s stunning tourist destinations and plan your next
          adventure with us!
        </p>
      </div>

      {loading && <p className="mt-6 text-center text-slate-500">Loading...</p>}
      {error && <p className="mt-6 text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="relative mt-8">
          <button
            onClick={() => scrollCards(-300)}
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-slate-900 p-3 text-white shadow-card-lg transition-colors hover:bg-blue-600 sm:block sm:p-4"
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>

          <div
            ref={cardRef}
            className="flex gap-4 overflow-x-auto overflow-y-hidden px-2 pb-5 pt-1 scroll-smooth no-scrollbar sm:gap-6 sm:px-6"
          >
            {areas.map((area) => (
              <div
                key={area._id}
                onClick={() => handleCardClick(area)}
                className="flex min-w-[250px] cursor-pointer flex-col rounded-2xl bg-white p-4 text-center shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-card-lg sm:min-w-[300px] sm:p-6 md:min-w-[350px]"
              >
                <img
                  src={resolveImage(area.image)}
                  alt={area.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                  className="mb-3 h-32 w-full rounded-xl object-cover sm:mb-4 sm:h-40"
                />
                <h3 className="mb-1 text-base font-bold text-slate-900 sm:mb-2 sm:text-lg">
                  {area.title}
                </h3>
                <p className="mb-2 text-xs text-slate-500 sm:mb-3 sm:text-sm">
                  {area.description}
                </p>
                <div className="mb-2 flex items-center justify-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < Math.floor(area.rating) ? "text-amber-400" : "text-slate-200"
                      } text-sm sm:text-base`}
                    />
                  ))}
                  {area.rating % 1 !== 0 && (
                    <FaStarHalfAlt className="text-sm text-amber-400 sm:text-base" />
                  )}
                </div>
                <p className="text-sm font-medium text-slate-800 sm:text-base">
                  Price: {area.price}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => scrollCards(300)}
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-slate-900 p-3 text-white shadow-card-lg transition-colors hover:bg-blue-600 sm:block sm:p-4"
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </section>
  );
};

export default TouristVisit;