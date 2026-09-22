import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBus, FaCar, FaArrowRight } from "react-icons/fa";
import { homeApi, API_BASE_URL } from "../api";
import type { Bus, Vehicle } from "../api/types";
import TransportCard, {
  type BusEnriched,
  type VehicleEnriched,
} from "./TransportCard";
import Reveal from "./Reveal";

const AvailableTransports = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<BusEnriched[]>([]);
  const [vehicles, setVehicles] = useState<VehicleEnriched[]>([]);

  useEffect(() => {
    const fetchTransports = async () => {
      try {
        const [busContent, vehicleContent] = await Promise.all([
          homeApi.getBuses(),
          homeApi.getVehicles(),
        ]);

        const allBuses = (busContent.buses || busContent.data || []) as Bus[];
        const allVehicles = (vehicleContent.vehicles || vehicleContent.data || []) as Vehicle[];

        const now = Date.now();

        const imageUrlFor = (image?: string) =>
          image
            ? image.startsWith("http")
              ? image
              : `${API_BASE_URL}${image}`
            : undefined;

        const upcomingBuses = allBuses
          .filter(
            (bus) =>
              bus.pricePerSeat > 0 &&
              (bus.totalSeats - (bus.bookedSeats?.length || 0)) > 0 &&
              (!bus.takeOffDate || new Date(bus.takeOffDate).getTime() >= now)
          )
          .sort(
            (a, b) =>
              (a.takeOffDate ? new Date(a.takeOffDate).getTime() : Number.MAX_SAFE_INTEGER) -
              (b.takeOffDate ? new Date(b.takeOffDate).getTime() : Number.MAX_SAFE_INTEGER)
          )
          .slice(0, 3);

        const availableVehicles = allVehicles
          .filter((vehicle) => vehicle.isAvailable !== false && vehicle.price > 0)
          .slice(0, 3);

        setBuses(
          upcomingBuses.map((bus) => ({
            ...bus,
            imageUrl: imageUrlFor(bus.image),
            availableSeats: bus.totalSeats - (bus.bookedSeats?.length || 0),
            price: bus.pricePerSeat || "N/A",
          }))
        );
        setVehicles(
          availableVehicles.map((vehicle) => ({
            ...vehicle,
            imageUrl: imageUrlFor(vehicle.image),
            price: vehicle.price || "N/A",
          }))
        );
      } catch (err) {
        console.error("Error fetching available transports:", err);
      }
    };

    fetchTransports();
  }, []);

  const handleSelect = (id: string, type: "bus" | "vehicle") => {
    if (type === "bus") {
      navigate(`/Seat_Selection/${id}`);
    } else {
      navigate(`/vehicle/${id}`);
    }
  };

  if (buses.length === 0 && vehicles.length === 0) return null;

  return (
    <section className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="section-eyebrow">Live Availability</p>
          <h2 className="section-title">Available Buses &amp; Vehicles</h2>
          <p className="mt-4 text-sm text-slate-500 sm:text-base">
            Ready to travel today? Here are the transports open for booking
            right now — grab a seat before they fill up.
          </p>
        </Reveal>

        {buses.length > 0 && (
          <div className="mt-10 space-y-4">
            <Reveal>
              <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <FaBus />
                </span>
                Available Buses
                <span className="rounded-full bg-blue-600/10 px-2.5 py-0.5 text-sm font-semibold text-blue-700">
                  {buses.length}
                </span>
              </h3>
            </Reveal>
            {buses.map((bus, index) => (
              <Reveal key={bus._id} delay={index * 90}>
                <TransportCard
                  data={bus}
                  onSelect={() => handleSelect(bus._id, "bus")}
                  type="bus"
                />
              </Reveal>
            ))}
          </div>
        )}

        {vehicles.length > 0 && (
          <div className="mt-10 space-y-4">
            <Reveal>
              <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <FaCar />
                </span>
                Available Vehicles
                <span className="rounded-full bg-blue-600/10 px-2.5 py-0.5 text-sm font-semibold text-blue-700">
                  {vehicles.length}
                </span>
              </h3>
            </Reveal>
            {vehicles.map((vehicle, index) => (
              <Reveal key={vehicle._id} delay={index * 90}>
                <TransportCard
                  data={vehicle}
                  onSelect={() => handleSelect(vehicle._id, "vehicle")}
                  type="vehicle"
                />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-10 text-center">
          <button
            type="button"
            onClick={() => navigate("/tickets")}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-blue-600/20 bg-blue-50 px-6 py-3 font-semibold text-blue-700 transition-colors hover:border-blue-600/40 hover:bg-blue-100"
          >
            View all buses &amp; vehicles
            <FaArrowRight />
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default AvailableTransports;