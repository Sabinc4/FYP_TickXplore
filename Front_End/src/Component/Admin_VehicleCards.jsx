import React from "react";
import SkeletonLoader from "./Admin_SkeletonLoader";

const VehicleCard = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Image Section */}
      <div className="h-48 overflow-hidden">
        <img
          src={
            vehicle.image?.startsWith("http")
              ? vehicle.image
              : `http://localhost:3001${vehicle.image || '/default-vehicle.jpg'}`
          }
          alt={vehicle.type || "Vehicle"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'http://localhost:3001/default-vehicle.jpg';
          }}
        />
      </div>

      {/* Info Section */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">
            {vehicle.type || "4x4"}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-sm text-gray-600">Price:</p>
            <p className="font-semibold">Rs. {vehicle.price || "12"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Capacity:</p>
            <p className="font-semibold">{vehicle.capacity || "12"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            <p className="text-sm text-gray-600">Take Off Date:</p>
            <p className="font-semibold">
              {vehicle.takeOffDate
                ? new Date(vehicle.takeOffDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const VehicleCards = ({ vehicles, loading }) => (
  <div className="p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Vehicles</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} type="card" />
          ))
        : vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
    </div>
  </div>
);

export default VehicleCards;
