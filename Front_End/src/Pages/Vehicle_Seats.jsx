import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCalendar, FiArrowRight, FiRefreshCw } from "react-icons/fi";
import { useParams } from "react-router-dom";

const VehicleReservation = () => {
  const { id } = useParams();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [takeOffDate, setTakeOffDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchVehicleById(id);
    } else {
      fetchVehicles();
    }
  }, [id]);

  // ✅ Fetch All Vehicles
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/vehicles");
      console.log("Fetched Vehicles:", response.data); // Debugging

      if (response.data.vehicles && response.data.vehicles.length > 0) {
        setVehicles(response.data.vehicles);
        setSelectedVehicle(response.data.vehicles[0]); // Default to the first vehicle
      } else {
        toast.warning("No available vehicles.");
        setVehicles([]);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error(error.response?.data?.message || "Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch a Specific Vehicle by ID
  const fetchVehicleById = async (vehicleId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/vehicles/${vehicleId}`);
      console.log("Fetched Vehicle Data:", response.data);
      setSelectedVehicle(response.data.vehicle);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      toast.error(error.response?.data?.message || "Failed to fetch vehicle details");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Payment & Reservation with Khalti
  const handlePaymentAndReservation = async () => {
    if (!selectedVehicle || !takeOffDate) {
      toast.error("Please select a vehicle and a take-off date");
      return;
    }

    try {
      const userId = localStorage.getItem("userId"); // Get logged-in user ID
      if (!userId) {
        toast.error("User not logged in.");
        return;
      }

      // 🔗 Initiate Khalti Payment
      const paymentResponse = await axios.post("http://localhost:3001/api/payments/initiate", {
        type: "vehicle",
        itemId: selectedVehicle._id,
        userInfo: {
          name: "John Doe", // Replace with actual user info
          email: "john@example.com",
          phone: "9800000000",
        },
        takeOffDate,
        userId,
      });

      if (paymentResponse.data.payment_url) {
        // Redirect to Khalti payment page
        window.location.href = paymentResponse.data.payment_url;
      } else {
        toast.error("Payment initiation failed.");
      }
    } catch (error) {
      console.error("❌ Payment Error:", error);
      toast.error("Failed to initiate payment.");
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
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.name} - {vehicle.pickupPoint} → {vehicle.dropPoint}
                    </option>
                  ))}
                </select>
              </div>

              {selectedVehicle && (
                <div className="bg-gray-50 p-4 sm:p-6 rounded-xl space-y-4">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={selectedVehicle.image}
                      alt={selectedVehicle.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = "/default-vehicle.jpg")}
                    />
                  </div>

                  <div className="space-y-2">
                    <DetailItem label="Vehicle Name" value={selectedVehicle?.name || "N/A"} />
                    <DetailItem label="Pickup Location" value={selectedVehicle?.pickupPoint || "Not Available"} />
                    <DetailItem label="Drop Location" value={selectedVehicle?.dropPoint || "Not Available"} />
                    <DetailItem label="Price" value={selectedVehicle?.price ? `Rs. ${selectedVehicle.price}` : "N/A"} />
                    <DetailItem label="Capacity" value={`${selectedVehicle?.capacity || "Unknown"} seats`} />
                    <DetailItem
                      label="Scheduled Departure"
                      value={
                        selectedVehicle?.takeOffDate
                          ? new Date(selectedVehicle.takeOffDate).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Not scheduled"
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Reservation Section */}
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 sm:p-6 rounded-xl border-2 border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <FiCalendar className="w-5 h-5" /> Select Departure Date
                </h3>

                <div className="space-y-4">
                  <input
                    type="date"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    value={takeOffDate}
                    onChange={(e) => setTakeOffDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />

                  <button
                    onClick={handlePaymentAndReservation}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Confirm Reservation
                    <FiArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {selectedVehicle && (
                <div className="bg-gray-50 p-4 sm:p-6 rounded-xl space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Reservation Summary</h4>
                  <div className="space-y-2">
                    <SummaryItem label="Total Amount" value={selectedVehicle.price} isTotal />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable Components
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-900 font-semibold">{value}</span>
  </div>
);

const SummaryItem = ({ label, value, isTotal }) => (
  <div className="flex justify-between items-center">
    <span className={`text-gray-600 ${isTotal ? "font-semibold" : ""}`}>{label}</span>
    <span className={`text-gray-900 ${isTotal ? "text-xl font-bold" : "font-medium"}`}>
      Rs. {typeof value === "number" ? value.toFixed(2) : value}
    </span>
  </div>
);

export default VehicleReservation;