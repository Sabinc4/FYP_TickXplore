import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCalendar, FiArrowRight, FiRefreshCw } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";

const VehicleReservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [takeOffDate, setTakeOffDate] = useState("");
  const [pickupPoint, setPickupPoint] = useState("");
  const [dropPoint, setDropPoint] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online"); // 'online' or 'cash'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (id) fetchVehicleById(id);
  }, [id]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/vehicles");
      const vehiclesWithAvailability = await Promise.all(
        response.data.vehicles.map(async (vehicle) => {
          const reservationsResponse = await axios.get(
            `http://localhost:3001/api/reservations/vehicle/${vehicle._id}`
          );
          const isAvailable = reservationsResponse.data.length === 0;
          return { ...vehicle, isAvailable };
        })
      );
      setVehicles(vehiclesWithAvailability);
      setSelectedVehicle(vehiclesWithAvailability[0] || null);
    } catch (error) {
      toast.error("Failed to fetch vehicles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleById = async (vehicleId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/vehicles/${vehicleId}`);
      const reservationsResponse = await axios.get(
        `http://localhost:3001/api/reservations/vehicle/${vehicleId}`
      );
      const isAvailable = reservationsResponse.data.length === 0;
      setSelectedVehicle({ ...response.data.vehicle, isAvailable });
    } catch (error) {
      toast.error("Failed to fetch vehicle details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentAndReservation = async () => {
    if (!selectedVehicle || !takeOffDate || !pickupPoint || !dropPoint) {
      toast.error("Please fill all required fields.");
      return;
    }

    const available = await checkAvailabilityBeforeBooking();
    if (!available) return;

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please log in to make a reservation.");
        return;
      }

      const payload = {
        type: "vehicle",
        itemId: selectedVehicle._id,
        takeOffDate,
        pickupPoint,
        dropPoint,
        userId,
      };

      if (paymentMethod === "online") {
        const paymentResponse = await axios.post("http://localhost:3001/api/payments/initiate", {
          ...payload,
          userInfo: {
            name: "John Doe", // Replace with actual user info
            email: "john@example.com",
            phone: "9800000000",
          },
        });

        if (paymentResponse.data.payment_url) {
          window.location.href = paymentResponse.data.payment_url;
        } else {
          toast.error("Payment initiation failed.");
        }
      } else {
        const response = await axios.post("http://localhost:3001/api/payments/cash-on-visit", payload);
        if (response.data.message) {
          toast.success(response.data.message);
          navigate("/my-bookings");
        } else {
          toast.error("Reservation failed. Please try again.");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process reservation.");
    }
  };

  const checkAvailabilityBeforeBooking = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/reservations/vehicle/${selectedVehicle._id}`
      );
      if (res.data.length > 0) {
        toast.error("This vehicle just got reserved. Please choose another.");
        fetchVehicles();
        return false;
      }
      return true;
    } catch (error) {
      toast.error("Could not verify vehicle availability.");
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!selectedVehicle && vehicles.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">No Available Vehicles</h2>
            <p className="text-gray-600 mb-4">All our vehicles are currently reserved. Please check back later.</p>
            <button
              onClick={fetchVehicles}
              className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <FiRefreshCw className="inline-block" /> Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vehicle Reservation</h1>
            <button
              onClick={fetchVehicles}
              className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
              title="Refresh vehicles"
            >
              <FiRefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Vehicle Selection and Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Vehicle</label>
                <select
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const vehicle = vehicles.find((v) => v._id === selectedId);
                    setSelectedVehicle(vehicle);
                  }}
                  value={selectedVehicle?._id || ""}
                >
                  <option value="" disabled>Select a Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id} disabled={!vehicle.isAvailable}>
                      {vehicle.name} - {vehicle.capacity} seats
                      {!vehicle.isAvailable && " (Booked)"}
                    </option>
                  ))}
                </select>
              </div>

              {selectedVehicle && (
                <div className="bg-gray-50 p-4 sm:p-6 rounded-xl space-y-4">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={selectedVehicle.image || "/default-vehicle.jpg"}
                      alt={selectedVehicle.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = "/default-vehicle.jpg")}
                    />
                  </div>

                  <div className="space-y-2">
                    <DetailItem label="Vehicle Name" value={selectedVehicle.name} />
                    <DetailItem label="Capacity" value={`${selectedVehicle.capacity} seats`} />
                    <DetailItem label="Price" value={`Rs. ${selectedVehicle.price}`} />
                    <DetailItem
                      label="Status"
                      value={
                        <span className={`font-semibold ${selectedVehicle.isAvailable ? "text-green-600" : "text-red-600"}`}>
                          {selectedVehicle.isAvailable ? "Available" : "Booked"}
                        </span>
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Reservation Form */}
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 sm:p-6 rounded-xl border-2 border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <FiCalendar className="w-5 h-5" /> Reservation Details
                </h3>

                <div className="space-y-4">
                  <input
                    type="date"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    value={takeOffDate}
                    onChange={(e) => setTakeOffDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <input
                    type="text"
                    placeholder="Pickup Location"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Drop-off Location"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    value={dropPoint}
                    onChange={(e) => setDropPoint(e.target.value)}
                  />

                  {/* Payment Method Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setPaymentMethod("online")}
                        className={`flex-1 p-3 rounded-lg border-2 flex items-center justify-center gap-2 ${
                          paymentMethod === "online"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        Online (Khalti)
                      </button>
                      <button
                        onClick={() => setPaymentMethod("cash")}
                        className={`flex-1 p-3 rounded-lg border-2 flex items-center justify-center gap-2 ${
                          paymentMethod === "cash"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        Cash on Visit
                      </button>
                    </div>
                  </div>

                  {paymentMethod === "cash" && (
                    <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">Cash on Visit Instructions:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>You'll pay cash when you receive the vehicle</li>
                        <li>Please bring the exact amount if possible</li>
                        <li>You’ll get confirmation email from TickXplore</li>
                        <li>Booking remains pending until payment</li>
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={handlePaymentAndReservation}
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                      paymentMethod === "online"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    disabled={!selectedVehicle?.isAvailable}
                  >
                    Confirm Reservation
                    <FiArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-900 font-semibold">{value}</span>
  </div>
);

export default VehicleReservation;
