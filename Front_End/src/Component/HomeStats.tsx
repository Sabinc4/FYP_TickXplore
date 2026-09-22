import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { FaBus, FaCar, FaRoute, FaMountain } from "react-icons/fa";
import { homeApi } from "../api";
import Reveal from "./Reveal";

interface StatItem {
  icon: IconType;
  label: string;
  value: number;
}

const HomeStats = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [busContent, vehicleContent, touristContent] = await Promise.all([
          homeApi.getBuses({ homepage: true }),
          homeApi.getVehicles({ homepage: true }),
          homeApi.getTouristAreas(),
        ]);

        const buses = (busContent.data || busContent.buses || []) as Array<{
          pickupPoint?: string;
          dropPoint?: string;
        }>;
        const vehicles = (vehicleContent.data || vehicleContent.vehicles || []) as Array<{
          pickupPoint?: string;
          dropPoint?: string;
        }>;

        const routes = new Set(
          [...buses, ...vehicles]
            .filter((b) => b.pickupPoint && b.dropPoint)
            .map((b) => `${b.pickupPoint} → ${b.dropPoint}`)
        );

        setStats([
          { icon: FaBus, label: "Bus Options", value: buses.length },
          { icon: FaCar, label: "Vehicle Rentals", value: vehicles.length },
          { icon: FaRoute, label: "Live Routes", value: routes.size },
          { icon: FaMountain, label: "Tourist Destinations", value: touristContent.length },
        ]);
      } catch (err) {
        console.error("Error fetching homepage stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || stats.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-12">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #60a5fa 0, transparent 40%), radial-gradient(circle at 80% 50%, #3b82f6 0, transparent 45%)",
        }}
      />
      <Reveal>
        <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:gap-4 lg:grid-cols-4 lg:px-8">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-center gap-4 text-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-2xl text-slate-800">
              <Icon />
            </div>
            <div className="text-left">
              <p className="text-3xl font-extrabold text-slate-900">
                {value.toLocaleString()}+
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                {label}
              </p>
            </div>
          </div>
        ))}
        </div>
      </Reveal>
    </section>
  );
};

export default HomeStats;