import { FaPen, FaTrash } from "react-icons/fa";
import InfoItem from "./Vendor_InfoItem";
import { API_BASE_URL, type Bus, type Vehicle } from "../../api";

export interface Reservation {
  _id: string;
  vehicleId: string;
  reservedFrom: string;
  pickupPoint?: string;
  dropPoint?: string;
}

type Transport = Bus | Vehicle;

interface TransportCardProps {
  item: Transport;
  type: "bus" | "vehicle";
  onEdit: (item: Transport) => void;
  onDelete: (id: string) => void;
  reservation?: Reservation;
}

const imageFor = (image?: string) =>
  image
    ? image.startsWith("http")
      ? image
      : `${API_BASE_URL}${image}`
    : "/default-transport.jpg";

const TransportCard = ({ item, type, onEdit, onDelete, reservation }: TransportCardProps) => {
  const bus = item as Bus;
  const vehicle = item as Vehicle;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-shadow duration-300 hover:shadow-card-lg">
      <div className="relative">
        <img
          src={imageFor(item.image)}
          alt={item.name || "Transport"}
          className="h-48 w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/default-transport.jpg";
          }}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => onEdit(item)}
            aria-label="Edit"
            className="rounded-full bg-white/90 p-2 transition-colors hover:bg-indigo-100"
          >
            <FaPen className="text-sm text-slate-700" />
          </button>
          <button
            onClick={() => onDelete(item._id)}
            aria-label="Delete"
            className="rounded-full bg-white/90 p-2 transition-colors hover:bg-rose-100"
          >
            <FaTrash className="text-sm text-rose-500" />
          </button>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>

        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {type === "bus" ? (
            <>
              <InfoItem label="Price per Seat" value={`NPR ${bus.pricePerSeat}`} />
              <InfoItem label="Total Seats" value={bus.totalSeats} />
              <InfoItem label="Pickup" value={bus.pickupPoint} />
              <InfoItem label="Drop" value={bus.dropPoint} />
              <InfoItem
                label="Take Off Date"
                value={
                  bus.takeOffDate
                    ? new Date(bus.takeOffDate).toLocaleString()
                    : "Not set"
                }
              />
              <InfoItem
                label="Status"
                value={
                  bus.takeOffDate &&
                  new Date(bus.takeOffDate).getTime() < Date.now() ? (
                    <span className="font-semibold text-red-600">Not Available</span>
                  ) : (
                    <span className="font-semibold text-green-600">Available</span>
                  )
                }
              />
            </>
          ) : (
            <>
              <InfoItem label="Price" value={`NPR ${vehicle.price}`} />
              <InfoItem label="Capacity" value={vehicle.capacity ?? vehicle.totalSeats ?? "-"} />
              <InfoItem
                label="Status"
                value={vehicle.isAvailable ? "Available" : "Reserved"}
              />
            </>
          )}
        </div>

        {type === "vehicle" && (
          <div className="mt-2 space-y-1 text-sm text-gray-700">
            {reservation ? (
              <>
                <p>
                  <strong>Departure:</strong>{" "}
                  {new Date(reservation.reservedFrom).toLocaleDateString()}
                </p>
                <p>
                  <strong>Pickup:</strong> {reservation.pickupPoint}
                </p>
                <p>
                  <strong>Drop:</strong> {reservation.dropPoint}
                </p>
              </>
            ) : (
              <p className="text-gray-500">No Reservation Yet</p>
            )}
          </div>
        )}

        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
          {type === "bus" && (
            <span>
              {bus.takeOffDate
                ? new Date(bus.takeOffDate).toLocaleDateString()
                : "Date not set"}
            </span>
          )}
          <span>{type.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default TransportCard;