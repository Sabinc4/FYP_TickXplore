import SkeletonLoader from "./Admin_SkeletonLoader";
import { X } from "lucide-react";
import { API_BASE_URL, type Vehicle } from "../api";

interface VehicleCardProps {
  vehicle: Vehicle;
  onRemove?: (vehicle: Vehicle) => void;
}

const imageFor = (image?: string) =>
  image
    ? image.startsWith("http")
      ? image
      : `${API_BASE_URL}${image}`
    : `${API_BASE_URL}/default-vehicle.jpg`;

const VehicleCard = ({ vehicle, onRemove }: VehicleCardProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card transition-shadow hover:shadow-card-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageFor(vehicle.image)}
          alt={vehicle.type || "Vehicle"}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `${API_BASE_URL}/default-vehicle.jpg`;
          }}
        />
        {onRemove && (
          <button
            onClick={() => onRemove(vehicle)}
            aria-label="Remove vehicle"
            className="absolute top-2 right-2 rounded-full bg-white/90 p-2 text-slate-700 transition-colors hover:bg-red-100 hover:text-red-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-lg font-bold text-gray-800">
          {vehicle.type || "4x4"}
        </h3>

        <div className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Price:</p>
            <p className="font-semibold">NPR {vehicle.price ?? "12"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Capacity:</p>
            <p className="font-semibold">{vehicle.capacity ?? vehicle.totalSeats ?? "12"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Status:</p>
            <p
              className={`font-semibold ${
                vehicle.isAvailable ? "text-green-600" : "text-red-600"
              }`}
            >
              {vehicle.isAvailable ? "Available" : "Reserved"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Earnings:</p>
            <p className="font-semibold">NPR {vehicle.totalEarnings ?? "0"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface VehicleCardsProps {
  vehicles: Vehicle[];
  loading: boolean;
  onRemove?: (vehicle: Vehicle) => void;
}

const VehicleCards = ({ vehicles, loading, onRemove }: VehicleCardsProps) => (
  <div className="rounded-2xl bg-white p-6 shadow-card">
    <h2 className="mb-6 text-2xl font-semibold text-gray-800">Vehicles</h2>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} type="card" />
          ))
        : vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} onRemove={onRemove} />
          ))}
    </div>
  </div>
);

export default VehicleCards;