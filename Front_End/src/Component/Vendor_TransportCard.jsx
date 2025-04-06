import React from "react";
import InfoItem from "../Component/Vendor_InfoItem";

const TransportCard = ({ item, type, onEdit, onDelete }) => (
  <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div className="relative">
      <img
        src={item.image ? item.image : "/default-transport.jpg"}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => onEdit(item)}
          className="p-2 bg-white/90 rounded-full hover:bg-blue-100 transition-colors"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="p-2 bg-white/90 rounded-full hover:bg-red-100 transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>

    <div className="p-4 space-y-3">
      <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {type === "bus" ? (
          <>
            <InfoItem label="Price per Seat" value={`Rs. ${item.pricePerSeat}`} />
            <InfoItem label="Total Seats" value={item.totalSeats} />
            <InfoItem label="Pickup" value={item.pickupPoint} />
            <InfoItem label="Drop" value={item.dropPoint} />
          </>
        ) : (
          <>
            <InfoItem label="Price" value={`Rs. ${item.price}`} />
            <InfoItem label="Capacity" value={item.capacity} />
            <InfoItem label="Status" value={item.isAvailable ? "Available" : "Reserved"} />
            <InfoItem label="Take Off Date" value={item.takeOffDate ? new Date(item.takeOffDate).toLocaleDateString() : "Not set"} />
          </>
        )}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>
          {item.takeOffDate ? 
            new Date(item.takeOffDate).toLocaleDateString() : 
            'Date not set'
          }
        </span>
        <span>{type.toUpperCase()}</span>
      </div>
    </div>
  </div>
);

export default TransportCard;