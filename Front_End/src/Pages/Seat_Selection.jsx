import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserTie, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const SeatAvailability = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [covSeats, setCovSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Online");

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        // Fetch bus data
        const response = await axios.get(`http://localhost:3001/api/buses/${id}`);
        const busData = response.data.bus;
        
        if (!busData) {
          toast.error("Bus not found.");
          return;
        }

        // Convert bookedSeats to numbers
        busData.bookedSeats = busData.bookedSeats.map(Number);
        setSelectedBus(busData);

        // DEBUG: Log booked seats
        console.log("Booked seats:", busData.bookedSeats);

        // Fetch Cash on Visit seats
        const covRes = await axios.get(`http://localhost:3001/api/payments/cov-seats/${id}`);
        const covSeatsData = covRes.data.covSeats || [];
        
        // DEBUG: Log CoV seats
        console.log("CoV seats:", covSeatsData);
        
        // Convert CoV seats to numbers and set state
        setCovSeats(covSeatsData.map(Number));
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [id]);

  const getSeatLabel = (seatNumber) => {
    const row = Math.floor((seatNumber - 1) / 4);
    const col = ((seatNumber - 1) % 4) + 1;
    return `${String.fromCharCode(65 + row)}${col}`;
  };

  const handleSeatSelection = (seatNumber) => {
    if (!selectedBus) return;

    // DEBUG: Check seat status
    console.log(`Seat ${seatNumber} - Booked: ${selectedBus.bookedSeats.includes(seatNumber)}, CoV: ${covSeats.includes(seatNumber)}`);

    // Check if seat is booked or CoV reserved
    if (selectedBus.bookedSeats.includes(seatNumber)) {
      toast.warning("This seat is already booked.");
      return;
    }
    
    if (covSeats.includes(seatNumber)) {
      toast.warning("This seat is reserved for Cash on Visit.");
      return;
    }

    const isSelected = selectedSeats.includes(seatNumber);
    const newSelectedSeats = isSelected
      ? selectedSeats.filter((num) => num !== seatNumber)
      : [...selectedSeats, seatNumber];

    setSelectedSeats(newSelectedSeats);
    setTotalPrice(newSelectedSeats.length * selectedBus.pricePerSeat);
  }; 

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }
  
    if (paymentMethod === "CashOnVisit") {
      // Create confirmation toast
      toast.info(
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">Confirm Cash on Visit Booking</h3>
          <p className="mb-2">
            Selected Seats: {selectedSeats.map(getSeatLabel).join(", ")}
          </p>
          <p className="mb-4">Total Price: Rs. {totalPrice}</p>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => {
                toast.dismiss();
                handleConfirmCashBooking();
              }}
            >
              Confirm
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => toast.dismiss()}
            >
              Cancel
            </button>
          </div>
        </div>,
        {
          autoClose: false,
          closeButton: false,
          position: "top-center",
        }
      );
    } else {
      navigate("/payment", {
        state: {
          busId: selectedBus._id,
          seats: selectedSeats,
          totalPrice,
        },
      });
    }
  };

  const handleConfirmCashBooking = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/payments/cash-on-visit",
        {
          type: "bus",
          itemId: selectedBus._id,
          userId: localStorage.getItem("userId"),
          seats: selectedSeats,
          takeOffDate: selectedBus.tripDate,
        }
      );
  
      toast.success(
        <div>
          <p className="font-semibold">Booking Successful!</p>
          <p>Seats: {selectedSeats.map(getSeatLabel).join(", ")}</p>
          <p>Total Paid: Rs. {totalPrice}</p>
          <p>Please arrive 30 minutes before departure</p>
        </div>,
        {
          autoClose: 5000,
          position: "top-center",
        }
      );
  
      setTimeout(() => {
        navigate("/my-bookings");
      }, 3000);
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Booking failed. Please try again.");
    }
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Journey Details on the Left */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Journey Details</h2>

          {/* Bus Image */}
          {selectedBus.image && (
            <div className="mb-4 sm:mb-6">
              <img
                src={
                  selectedBus.image.startsWith("http")
                    ? selectedBus.image
                    : `http://localhost:3001${selectedBus.image}`
                }
                alt="Bus"
                className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-sm"
                onError={(e) => {
                  e.target.src = "/default-bus-image.jpg";
                }}
              />
            </div>
          )}

          {/* Trip Details */}
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <FaCalendarAlt className="text-gray-600" size={20} />
              <div>
                <p className="text-gray-600 font-semibold">Trip Date</p>
                <p className="text-gray-800 text-base sm:text-lg">
                  {new Date(selectedBus.tripDate).toLocaleDateString("en-US")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <FaMapMarkerAlt className="text-gray-600" size={20} />
              <div>
                <p className="text-gray-600 font-semibold">Pickup Point</p>
                <p className="text-gray-800 text-base sm:text-lg">{selectedBus.pickupPoint}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <FaMapMarkerAlt className="text-gray-600" size={20} />
              <div>
                <p className="text-gray-600 font-semibold">Drop Point</p>
                <p className="text-gray-800 text-base sm:text-lg">{selectedBus.dropPoint}</p>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Online">Pay via Khalti</option>
              <option value="CashOnVisit">Cash on Visit</option>
            </select>
          </div>

          {/* Selected Seats */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Selected Seats</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="p-2 sm:p-3 text-left rounded-tl-lg">Seat</th>
                  <th className="p-2 sm:p-3 text-right rounded-tr-lg">Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedSeats.map((seatNumber) => (
                  <tr key={seatNumber} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-2 sm:p-3 text-left">Seat {getSeatLabel(seatNumber)}</td>
                    <td className="p-2 sm:p-3 text-right">Rs. {selectedBus.pricePerSeat}</td>
                  </tr>
                ))}
                <tr className="bg-gray-100">
                  <td className="p-2 sm:p-3 text-left font-bold">Total</td>
                  <td className="p-2 sm:p-3 text-right font-bold">Rs. {totalPrice}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Continue to Payment Button */}
          <button
            onClick={handleProceedToPayment}
            className="mt-4 sm:mt-6 w-full bg-green-600 text-white py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-base sm:text-lg font-semibold"
          >
            Continue to Payment
          </button>
        </div>

        {/* Bus Layout on the Right */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Bus Layout</h2>

          {/* Front Section */}
          <div className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4">FRONT</div>

          {/* Driver Icon - Positioned above A4 */}
          <div className="flex justify-end pr-[30px] sm:pr-[46px] mb-2">
            <FaUserTie size={24} className="text-gray-700" />
          </div>

          {/* Door Label - Positioned above A1 and to the left */}
          <div className="flex items-center gap-3 sm:gap-4 pl-2 mb-2">
            <div className="text-gray-600 w-10 sm:w-12 text-center">DOOR</div>
            <div className="w-10 sm:w-12"></div>
          </div>
          {/* Seat Grid */}
          <div className="flex flex-col gap-2 sm:gap-3">
            {Array.from({ length: Math.ceil(selectedBus.totalSeats / 4) }, (_, rowIndex) => {
              const rowLabel = String.fromCharCode(65 + rowIndex);
              return (
                <div key={rowLabel} className="flex items-center gap-3 sm:gap-4 pl-2">
                  <div className="w-10 sm:w-12"></div>
                  <div className="flex gap-2 sm:gap-4">
                    {[1, 2, 3, 4].map((colNum) => {
                      const seatNumber = rowIndex * 4 + colNum;
                      if (seatNumber > selectedBus.totalSeats) return null;

                      const seatLabel = getSeatLabel(seatNumber);
                      const isBooked = selectedBus.bookedSeats.includes(seatNumber);
                      const isCoV = covSeats.includes(seatNumber);
                      const isSelected = selectedSeats.includes(seatNumber);

                      // Debug logging
                      console.log(`Seat ${seatNumber} (${seatLabel}):`, {
                        isBooked,
                        isCoV,
                        isSelected,
                        covSeatsList: covSeats,
                        bookedSeatsList: selectedBus.bookedSeats
                      });

                      let gapStyle = "";
                      if (colNum === 2) gapStyle = "mr-12 sm:mr-20";
                      if (colNum === 1 || colNum === 3) gapStyle = "mr-2 sm:mr-4";

                      // Determine seat status and styling
                      let seatStatus = "available";
                      if (isBooked) seatStatus = "booked";
                      if (isCoV) seatStatus = "cov";
                      if (isSelected) seatStatus = "selected";

                      const seatClasses = {
                        booked: "bg-red-500 text-white cursor-not-allowed",
                        cov: "bg-blue-500 text-white cursor-not-allowed",
                        selected: "bg-green-500 text-white hover:bg-green-600",
                        available: "bg-gray-100 border hover:bg-gray-200"
                      };

                      return (
                        <div key={seatNumber} className={`${gapStyle}`}>
                          <button
                            onClick={() => handleSeatSelection(seatNumber)}
                            disabled={seatStatus === "booked" || seatStatus === "cov"}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg font-bold transition-colors ${seatClasses[seatStatus]}`}
                            data-seat-status={seatStatus}
                            data-seat-number={seatNumber}
                          >
                            {seatLabel}
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
          <div className="text-lg sm:text-xl font-bold text-center mt-4 sm:mt-6">REAR</div>

          {/* Seat Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 mr-2 rounded"></div>
              <span className="text-sm">Booked</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 mr-2 rounded"></div>
              <span className="text-sm">Cash on Visit</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 border mr-2 rounded"></div>
              <span className="text-sm">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatAvailability;