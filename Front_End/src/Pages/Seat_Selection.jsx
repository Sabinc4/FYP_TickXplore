import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdEventSeat } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SeatAvailability = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [dropLocations, setDropLocations] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState("");
  const [selectedDrop, setSelectedDrop] = useState("");

  // Fetch buses & extract locations from bus database
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/buses");
        const busData = response.data.buses;
        setBuses(busData);

        // Extract unique pickup and drop locations
        const uniquePickupPoints = [...new Set(busData.map((bus) => bus.pickupPoint))];
        const uniqueDropPoints = [...new Set(busData.map((bus) => bus.dropPoint))];

        setPickupLocations(uniquePickupPoints);
        setDropLocations(uniqueDropPoints);

        if (busData.length > 0) {
          setSelectedBus(busData[0]); // Select first bus by default
        }
      } catch (error) {
        toast.error("Failed to fetch buses. Please try again.");
      }
    };

    fetchBuses();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg w-full max-w-5xl p-6 gap-6">
        {/* Left Section: Journey Details */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Journey Details</h2>

          <label className="block text-gray-700 mb-1">Journey Date</label>
          <input type="date" className="w-full p-2 border rounded-md mb-4" />

          <label className="block text-gray-700 mb-1">Pickup Point</label>
          <select
            className="w-full p-2 border rounded-md mb-4"
            value={selectedPickup}
            onChange={(e) => setSelectedPickup(e.target.value)}
          >
            <option value="">Select Pickup</option>
            {pickupLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>

          <label className="block text-gray-700 mb-1">Dropping Point</label>
          <select
            className="w-full p-2 border rounded-md mb-4"
            value={selectedDrop}
            onChange={(e) => setSelectedDrop(e.target.value)}
          >
            <option value="">Select Drop</option>
            {dropLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>

          <button className="w-full mt-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700">
            Continue
          </button>
        </div>

        {/* Right Section: Seat Selection */}
        <div className="w-full md:w-2/3 bg-gray-50 p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Click on a Seat to Select</h2>

          {/* Seat Layout */}
          <div className="p-4 border rounded-md bg-white">
            <div className="text-center font-semibold text-gray-600 mb-2">FRONT</div>
            <div className="grid grid-cols-5 gap-2">
              {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map((row) =>
                [1, 2, "", 3, 4].map((num, index) => {
                  if (num === "") return <div key={`${row}-${index}`} className="w-8"></div>;

                  const seatId = `${row}${num}`;
                  const isBooked = selectedBus?.bookedSeats?.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <div
                      key={seatId}
                      className={`flex items-center justify-center w-12 h-12 border rounded-md text-gray-700 font-medium cursor-pointer ${
                        isBooked
                          ? "bg-red-500 text-white cursor-not-allowed" // Booked seats in red
                          : isSelected
                          ? "bg-green-500 text-white" // Selected seats in green
                          : "bg-white hover:bg-gray-200" // Available seats
                      }`}
                      onClick={() => !isBooked && setSelectedSeats((prev) =>
                        prev.includes(seatId)
                          ? prev.filter((seat) => seat !== seatId)
                          : [...prev, seatId]
                      )}
                    >
                      {seatId}
                    </div>
                  );
                })
              )}
            </div>
            <div className="text-center font-semibold text-gray-600 mt-2">REAR</div>
          </div>

          {/* Seat Legend */}
          <div className="flex justify-between mt-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-white border border-gray-400 mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 border border-gray-400 mr-2"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-500 border border-gray-400 mr-2"></div>
              <span>Booked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatAvailability;
