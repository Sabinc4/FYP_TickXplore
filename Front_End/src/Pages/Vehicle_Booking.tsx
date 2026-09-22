import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaCarSide } from "react-icons/fa";
import { homeApi, API_BASE_URL, type Vehicle } from "../api";

const VehicleBooking = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const content = await homeApi.getVehicles();
        setVehicles((content.vehicles || content.data || []) as Vehicle[]);
      } catch (err) {
        console.error("Failed to load vehicles:", err);
        setError("Failed to load vehicles. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const imageFor = (image?: string) =>
    image
      ? image.startsWith("http")
        ? image
        : `${API_BASE_URL}${image}`
      : "/default-vehicle.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="section-eyebrow">4x4 · Jeep · E-Van</p>
          <h1 className="section-title">Book Your Vehicle</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-500 sm:text-base">
            Reserve a private vehicle for your next trip across Nepal — mountain
            trails, city drives, or group tours.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-blue-600" />
          </div>
        )}

        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (vehicles.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-card">
            <FaCarSide className="mx-auto mb-4 text-5xl text-blue-500" />
            <h3 className="mb-2 text-xl font-semibold text-slate-900">
              No vehicles available right now
            </h3>
            <p className="text-slate-500">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-lg"
                onClick={() => navigate(`/vehicle/${vehicle._id}`)}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={imageFor(vehicle.image)}
                    alt={vehicle.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/default-vehicle.jpg";
                    }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900">{vehicle.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {vehicle.totalSeats || vehicle.capacity || 4} seats
                    {vehicle.pickupPoint && vehicle.dropPoint
                      ? ` · ${vehicle.pickupPoint} → ${vehicle.dropPoint}`
                      : ""}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-emerald-600">
                      NPR {vehicle.price}
                    </span>
                    <span className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-blue-700">
                      Book Now <FaArrowRight />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleBooking;