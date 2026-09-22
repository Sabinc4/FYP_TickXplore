import TransportCard from "./Vendor_TransportCard";
import type { Reservation } from "./Vendor_TransportCard";
import type { Bus, Vehicle } from "../api";

export type { Reservation };

interface TransportSectionProps {
  title: string;
  items: (Bus | Vehicle)[];
  type: "bus" | "vehicle";
  onEdit: (item: Bus | Vehicle) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  reservations?: Reservation[];
}

const TransportSection = ({
  title,
  items,
  type,
  onEdit,
  onDelete,
  onAddNew,
  reservations = [],
}: TransportSectionProps) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <button
        onClick={onAddNew}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Add New
      </button>
    </div>

    {items.length === 0 ? (
      <div className="rounded-lg bg-white p-6 text-center shadow-md">
        <p className="mb-4 text-gray-500">No {type}s available.</p>
        <button
          onClick={onAddNew}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Your First {type === "vehicle" ? "Vehicle" : "Bus"}
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <TransportCard
            key={item._id}
            item={item}
            type={type}
            onEdit={onEdit}
            onDelete={onDelete}
            reservation={
              type === "vehicle"
                ? reservations.find((r) => String(r.vehicleId) === String(item._id))
                : undefined
            }
          />
        ))}
      </div>
    )}
  </div>
);

export default TransportSection;