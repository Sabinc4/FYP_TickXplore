import React from "react";
import TransportCard from "../Component/Vendor_TransportCard";

const TransportSection = ({ title, items, type, onEdit, onDelete, onAddNew, reservations = [] }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <button
        onClick={onAddNew}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Add New
      </button>
    </div>

    {items.length === 0 ? (
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-500 mb-4">No {type}s available.</p>
        <button
          onClick={onAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Your First {type === "vehicle" ? "Vehicle" : "Bus"}
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <TransportCard
            key={item._id}
            item={item}
            type={type}
            onEdit={onEdit}
            onDelete={onDelete}
            reservation={
              type === "vehicle"
                ? reservations.find(r => String(r.vehicleId) === String(item._id)) // ✅ FIXED here
                : undefined
            }
          />
        ))}
      </div>
    )}
  </div>
);

export default TransportSection;
