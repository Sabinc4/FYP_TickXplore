import SkeletonLoader from "./Admin_SkeletonLoader";
import { X } from "lucide-react";
import { API_BASE_URL, type Bus } from "../api";

interface BusCardProps {
  bus: Bus;
  onRemove?: (bus: Bus) => void;
}

const imageFor = (image?: string) =>
  image
    ? image.startsWith("http")
      ? image
      : `${API_BASE_URL}${image}`
    : `${API_BASE_URL}/default-bus.jpg`;

const BusCard = ({ bus, onRemove }: BusCardProps) => {
  const bookedSeats = Array.isArray(bus.bookedSeats) ? bus.bookedSeats.length : 0;
  const totalSeats = Number(bus.totalSeats) || 1;
  const hasDeparted =
    !!bus.takeOffDate && new Date(bus.takeOffDate).getTime() < Date.now();
  const status = hasDeparted ? "Not Available" : bus.status || "Available";
  const statusColor = status === "Available" ? "text-green-600" : "text-red-600";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card transition-shadow hover:shadow-card-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageFor(bus.image)}
          alt={bus.name || "Bus"}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `${API_BASE_URL}/default-bus.jpg`;
          }}
        />
        {onRemove && (
          <button
            onClick={() => onRemove(bus)}
            aria-label="Remove bus"
            className="absolute top-2 right-2 rounded-full bg-white/90 p-2 text-slate-700 transition-colors hover:bg-red-100 hover:text-red-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-lg font-bold text-gray-800">
          {bus.name || "Mountain Bus"}
        </h3>

        <div className="mb-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Price per Seat:</p>
            <p className="font-semibold">NPR {bus.pricePerSeat ?? "12"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Seats:</p>
            <p className="font-semibold">{totalSeats === 1 ? bus.totalSeats || "32" : totalSeats}</p>
          </div>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Pickup:</p>
            <p className="font-semibold">{bus.pickupPoint || "Kathmandu"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Drop:</p>
            <p className="font-semibold">{bus.dropPoint || "Dhangadi"}</p>
          </div>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Take Off Date:</p>
            <p className="font-semibold">
              {bus.takeOffDate || bus.date || "3/26/2025"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status:</p>
            <p className={`font-semibold ${statusColor}`}>{status}</p>
          </div>
        </div>

        <div className="mt-3 border-t border-gray-100 pt-3">
          <p className="text-sm text-gray-600">Booked Seats:</p>
          <div className="mt-1 h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-blue-600"
              style={{ width: `${Math.min(100, (bookedSeats / totalSeats) * 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {bookedSeats} / {bus.totalSeats || "N/A"} seats booked
          </p>
        </div>
      </div>
    </div>
  );
};

interface BusCardsProps {
  buses: Bus[];
  loading: boolean;
  onRemove?: (bus: Bus) => void;
}

const BusCards = ({ buses, loading, onRemove }: BusCardsProps) => (
  <div className="rounded-2xl bg-white p-6 shadow-card">
    <h2 className="mb-6 text-2xl font-semibold text-gray-800">Buses</h2>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} type="card" />
          ))
        : buses.map((bus) => (
            <BusCard key={bus._id} bus={bus} onRemove={onRemove} />
          ))}
    </div>
  </div>
);

export default BusCards;