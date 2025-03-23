import React from "react";
import SkeletonLoader from "./SkeletonLoader";

const VehicleCards = ({ vehicles, loading }) => (
  <div className="p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Vehicles</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} type="card" />
          ))
        : vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img
                src={vehicle.image.startsWith("http") ? vehicle.image : `http://localhost:3001${vehicle.image}`}
                alt={vehicle.name || "Vehicle Image"}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                <p className="text-gray-600">Type: {vehicle.type}</p>
                <p className="text-gray-600">Price: Rs. {vehicle.price}</p>
                <p className="text-gray-600">Availability: {vehicle.isAvailable ? "Available" : "Not Available"}</p>
              </div>
            </div>
          ))}
    </div>
  </div>
);

export default VehicleCards;