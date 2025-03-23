import React from "react";
import SkeletonLoader from "../Component/SkeletonLoader";

const BusCards = ({ buses, loading }) => (
  <div className="p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Buses</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} type="card" />
          ))
        : buses.map((bus) => (
            <div
              key={bus._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img
                src={bus.image.startsWith("http") ? bus.image : `http://localhost:3001${bus.image}`}
                alt={bus.busName || "Bus Image"}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{bus.busName}</h3>
                <p className="text-gray-600">Price Per Seat: Rs. {bus.pricePerSeat}</p>
                <p className="text-gray-600">Pickup: {bus.pickupPoint}</p>
                <p className="text-gray-600">Drop: {bus.dropPoint}</p>
                <p className="text-gray-600">Total Seats: {bus.totalSeats}</p>
                <p className="text-gray-600">Booked Seats: {bus.bookedSeats?.length || 0}</p>
              </div>
            </div>
          ))}
    </div>
  </div>
);

export default BusCards;