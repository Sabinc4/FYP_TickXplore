import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaRoute } from "react-icons/fa";
import { homeApi } from "../api";
import Reveal from "./Reveal";

interface Route {
  pickup: string;
  drop: string;
  count: number;
}

const dayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const PopularRoutes = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const [busContent, vehicleContent] = await Promise.all([
          homeApi.getBuses({ homepage: true }),
          homeApi.getVehicles({ homepage: true }),
        ]);

        const all = [
          ...(busContent.data || busContent.buses || []),
          ...(vehicleContent.data || vehicleContent.vehicles || []),
        ].filter((b) => b.pickupPoint && b.dropPoint);

        const counts = new Map<string, { pickup: string; drop: string; count: number }>();
        for (const item of all) {
          const key = `${item.pickupPoint}|${item.dropPoint}`;
          const existing = counts.get(key);
          if (existing) {
            existing.count += 1;
          } else {
            counts.set(key, {
              pickup: item.pickupPoint as string,
              drop: item.dropPoint as string,
              count: 1,
            });
          }
        }

        setRoutes(
          [...counts.values()]
            .sort((a, b) => b.count - a.count)
            .slice(0, 8)
        );
      } catch (err) {
        console.error("Error fetching popular routes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  if (loading || routes.length === 0) return null;

  const handleRoute = (route: Route) => {
    navigate(
      `/tickets?pickup=${encodeURIComponent(route.pickup)}&drop=${encodeURIComponent(route.drop)}&date=${encodeURIComponent(dayKey())}`
    );
  };

  return (
    <section className="bg-gradient-to-b from-white to-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
      <Reveal>
        <p className="section-eyebrow">Popular Routes</p>
        <h2 className="section-title">Where Are You Travelling Next?</h2>
        <p className="mt-4 text-sm text-slate-500 sm:text-base">
          Most-booked journeys across Nepal — tap a route to find available
          buses and vehicles instantly.
        </p>
      </Reveal>
    </div>

    <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {routes.map((route, index) => (
          <Reveal key={`${route.pickup}|${route.drop}`} delay={(index % 4) * 90}>
            <button
            type="button"
            onClick={() => handleRoute(route)}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-card-lg"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                <FaRoute />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {route.pickup} → {route.drop}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {route.count} option{route.count > 1 ? "s" : ""} available
                </p>
              </div>
            </div>
            <FaArrowRight className="shrink-0 text-slate-400 transition-colors group-hover:text-blue-600" />
          </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default PopularRoutes;