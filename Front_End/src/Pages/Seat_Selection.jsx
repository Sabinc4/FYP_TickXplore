import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserTie, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const SeatAvailability = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/buses");
        const busData = response.data.buses;
        setBuses(busData);
        if (busData.length > 0) {
          setSelectedBus(busData[0]);
        }
      } catch (error) {
        toast.error("Failed to fetch buses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  const getSeatLabel = (seatNumber) => {
    const row = Math.floor((seatNumber - 1) / 4);
    const col = ((seatNumber - 1) % 4) + 1;
    return `${String.fromCharCode(65 + row)}${col}`;
  };

  const handleSeatSelection = (seatNumber) => {
    if (!selectedBus) return;
    const isSelected = selectedSeats.includes(seatNumber);

    const newSelectedSeats = isSelected
      ? selectedSeats.filter((num) => num !== seatNumber)
      : [...selectedSeats, seatNumber];

    setSelectedSeats(newSelectedSeats);
    setTotalPrice(newSelectedSeats.length * selectedBus.pricePerSeat);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ClipLoader color="#4A90E2" size={50} />
        <p className="ml-4 text-lg font-semibold text-gray-700">Loading bus data...</p>
      </div>
    );
  }

  if (!selectedBus) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-700">No buses available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Journey Details on the Left */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex-1 md:w-2/3">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Journey Details</h2>
          
          {/* Bus Image */}
          {selectedBus.busImage && (
            <div className="mb-6">
              <img
                src={selectedBus.busImage}
                alt="Bus"
                className="w-full h-48 object-cover rounded-lg shadow-sm"
              />
            </div>
          )}

          {/* Trip Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-4">
              <FaCalendarAlt className="text-gray-600" size={24} />
              <div>
                <p className="text-gray-600 font-semibold">Trip Date</p>
                <p className="text-gray-800 text-lg">{new Date(selectedBus.tripDate).toLocaleDateString("en-US")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-gray-600" size={24} />
              <div>
                <p className="text-gray-600 font-semibold">Pickup Point</p>
                <p className="text-gray-800 text-lg">{selectedBus.pickupPoint}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-gray-600" size={24} />
              <div>
                <p className="text-gray-600 font-semibold">Drop Point</p>
                <p className="text-gray-800 text-lg">{selectedBus.dropPoint}</p>
              </div>
            </div>
          </div>

          {/* Selected Seats */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Selected Seats</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-3 text-left rounded-tl-lg">Seat</th>
                <th className="p-3 text-right rounded-tr-lg">Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedSeats.map((seatNumber) => (
                <tr key={seatNumber} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 text-left">Seat {getSeatLabel(seatNumber)}</td>
                  <td className="p-3 text-right">Rs. {selectedBus.pricePerSeat}</td>
                </tr>
              ))}
              <tr className="bg-gray-100">
                <td className="p-3 text-left font-bold">Total</td>
                <td className="p-3 text-right font-bold">Rs. {totalPrice}</td>
              </tr>
            </tbody>
          </table>

          {/* Continue to Payment Button */}
          <button className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-lg font-semibold">
            Continue to Payment
          </button>
        </div>

        {/* Bus Layout on the Right */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex-1 md:w-1/3">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Bus Layout</h2>
          
          {/* Front Section */}
          <div className="text-xl font-bold text-center mb-4">FRONT</div>

          {/* Driver Icon - Positioned above A4 */}
          <div className="flex justify-end pr-[46px] mb-2">
            <FaUserTie size={30} className="text-gray-700" />
          </div>

          {/* Door Label - Positioned above A1 and to the left */}
          <div className="flex items-center gap-4 pl-2 mb-2">
            <div className="text-gray-600 w-12 text-center">DOOR</div>
            <div className="w-12"></div> {/* Spacer for alignment */}
          </div>

          {/* Seat Grid */}
          <div className="flex flex-col gap-3">
            {Array.from({ length: 10 }, (_, rowIndex) => {
              const rowLabel = String.fromCharCode(65 + rowIndex);
              return (
                <div key={rowLabel} className="flex items-center gap-4 pl-2">
                  {/* Spacer for alignment */}
                  <div className="w-12"></div>

                  {/* Seats */}
                  <div className="flex gap-4">
                    {[1, 2, 3, 4].map((colNum) => {
                      const seatNumber = rowIndex * 4 + colNum;
                      const seatLabel = getSeatLabel(seatNumber);
                      const isBooked = selectedBus.bookedSeats.includes(seatNumber);
                      const isSelected = selectedSeats.includes(seatNumber);

                      let gapStyle = "";
                      if (colNum === 2) gapStyle = "mr-20";
                      if (colNum === 1 || colNum === 3) gapStyle = "mr-4";

                      return (
                        <div key={seatNumber} className={`${gapStyle}`}>
                          <button
                            disabled={isBooked}
                            onClick={() => handleSeatSelection(seatNumber)}
                            className={`w-12 h-12 flex items-center justify-center rounded-lg text-sm font-semibold border-2 transition-colors
                              ${isBooked ? "bg-gray-300 text-gray-500 cursor-not-allowed" :
                                isSelected ? "bg-green-500 text-white hover:bg-green-600" :
                                "bg-white border-gray-400 hover:bg-gray-100"}`}
                            aria-label={`Seat ${seatLabel}`}
                          >
                            <span className="ml-1">{seatLabel}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rear Section */}
          <div className="text-xl font-bold text-center mt-6">REAR</div>
        </div>
      </div>
    </div>
  );
};

export default SeatAvailability;