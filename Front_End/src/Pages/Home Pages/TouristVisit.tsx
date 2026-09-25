import { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { homeApi, API_BASE_URL } from "../api";
import type { TouristArea } from "../api/types";
import { slugForTitle } from "../blogs";
import Reveal from "./Reveal";

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
      <Reveal>
        <p className="section-eyebrow">Must Visit</p>
        <h2 className="section-title">Explore Popular Tourist Areas</h2>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Discover Nepal’s stunning tourist destinations and plan your next
          adventure with us!
        </p>
      </Reveal>
    </div>

      {loading && <p className="mt-6 text-center text-slate-500">Loading...</p>}
      {error && <p className="mt-6 text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <Reveal>
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
            {areas.map((area) => {
              const blogSlug = slugForTitle(area.title);
              return (
              <div
                key={area._id}
                onClick={() => handleCardClick(area)}
                className="group flex min-w-[250px] cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-lg sm:min-w-[300px] md:min-w-[350px]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200 sm:aspect-[3/2]">
                  <img
                    src={resolveImage(area.image)}
                    alt={area.title}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4 text-center sm:p-5">
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                    {area.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500 sm:text-sm">
                    {area.description}
                  </p>
                  {blogSlug && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/blogs/${blogSlug}`);
                      }}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 active:scale-[0.98] sm:text-sm"
                    >
                      Read More <FaArrowRight />
                    </button>
                  )}
                </div>
              </div>
              );
            })}
          </div>

          <button
            onClick={() => scrollCards(300)}
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-slate-900 p-3 text-white shadow-card-lg transition-colors hover:bg-blue-600 sm:block sm:p-4"
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        </div>
        </Reveal>
      )}
    </section>
  );
};

export default TouristVisit;