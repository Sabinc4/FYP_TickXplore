import React from "react";
import SkeletonLoader from "./Admin_SkeletonLoader";

const BusCard = ({ bus }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Image Section */}
      <div className="h-48 overflow-hidden">
        <img
          src={bus.image?.startsWith("http") 
            ? bus.image 
            : `http://localhost:3001${bus.image || '/default-bus.jpg'}`}
          alt={bus.busName || "Bus"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'http://localhost:3001/default-bus.jpg';
          }}
        />
      </div>
      
      {/* Info Section */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{bus.busName || "Mountain Bus"}</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-sm text-gray-600">Price per Seat:</p>
            <p className="font-semibold">Rs. {bus.pricePerSeat || "12"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Seats:</p>
            <p className="font-semibold">{bus.totalSeats || "32"}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-sm text-gray-600">Pickup:</p>
            <p className="font-semibold">{bus.pickupPoint || "Kathmandu"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Drop:</p>
            <p className="font-semibold">{bus.dropPoint || "Dhangadi"}</p>
          </div>
        </div>

        {/* New Take Off Date Section */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-sm text-gray-600">Take Off Date:</p>
            <p className="font-semibold">{bus.takeOffDate || bus.date || "3/26/2025"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status:</p>
            <p className={`font-semibold ${
              bus.status === "Available" ? "text-green-600" : "text-red-600"
            }`}>
              {bus.status || "Available"}
            </p>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">Booked Seats:</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, ((bus.bookedSeats?.length || 0) / (bus.totalSeats || 1)) * 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {bus.bookedSeats?.length || 0} / {bus.totalSeats || "N/A"} seats booked
          </p>
        </div>
      </div>
    </div>
  );
};

const BusCards = ({ buses, loading }) => (
  <div className="p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Buses</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} type="card" />
          ))
        : buses.map((bus) => (
            <BusCard key={bus._id} bus={bus} />
          ))}
    </div>
  </div>
);

export default BusCards;