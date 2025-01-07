import React, { useState } from "react";
import { MdEventSeat } from "react-icons/md";

const SeatAvailability = () => {
  // Sample data for buses and seats
  const buses = [
    { id: 1, name: "Bus A", totalSeats: 30, bookedSeats: [] },
    { id: 2, name: "Bus B", totalSeats: 25, bookedSeats: [] },
  ];

  const [selectedBus, setSelectedBus] = useState(buses[0]); // Default to the first bus
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeatSelection = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-6">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Seat Availability
        </h1>

        {/* Bus Details */}
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            Selected Bus: <span className="text-blue-600">{selectedBus.name}</span>
          </h2>
          <p className="text-gray-600">
            Total Seats: {selectedBus.totalSeats} | Booked Seats:{" "}
            {selectedBus.bookedSeats.length}
          </p>
        </div>

        {/* Seat Grid */}
        <div className="grid grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg shadow-inner">
          {Array.from({ length: selectedBus.totalSeats }, (_, i) => i + 1).map(
            (seat) => {
              const isBooked = selectedBus.bookedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);

              return (
                <div
                  key={seat}
                  className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer transition-transform transform hover:scale-105 ${
                    isBooked
                      ? "bg-red-500 text-white cursor-not-allowed"
                      : isSelected
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => !isBooked && toggleSeatSelection(seat)}
                >
                  <MdEventSeat size={30} />
                  <span className="mt-2 text-sm font-medium">{seat}</span>
                </div>
              );
            }
          )}
        </div>

        {/* Selected Seats */}
        {selectedSeats.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-medium text-gray-700">
              Selected Seats:{" "}
              <span className="text-green-600 font-bold">
                {selectedSeats.join(", ")}
              </span>
            </h3>
            <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatAvailability;
