import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCalendar, FiArrowRight, FiRefreshCw, FiCreditCard } from "react-icons/fi";

const VehicleReservation = () => {
  // State Management
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [takeOffDate, setTakeOffDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  // Fetch Available Vehicles
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/vehicles");
      const availableVehicles = response.data.vehicles.filter((v) => v.isAvailable);
      setVehicles(availableVehicles);
      if (availableVehicles.length > 0) {
        setSelectedVehicle(availableVehicles[0]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  // Handle Reservation Confirmation
  const handleReservationConfirmation = () => {
    if (!selectedVehicle || !takeOffDate) {
      toast.error("Please select a vehicle and a take-off date");
      return;
    }
    setShowPaymentForm(true);
  };

  // Handle Payment Submission
  const handlePayment = async () => {
    if (!validatePaymentDetails()) {
      toast.error("Please fill all payment details correctly");
      return;
    }

    try {
      // Simulate payment processing
      const paymentResponse = await processPayment(paymentDetails);

      if (paymentResponse.success) {
        // Reserve the vehicle after successful payment
        const reservationResponse = await axios.post(
          `http://localhost:3001/api/vehicles/reserve/${selectedVehicle._id}`,
          {
            userId: "user123", // Replace with real user ID
            takeOffDate,
            fullVehicle: true,
          }
        );

        toast.success("Payment successful! " + reservationResponse.data.message);
        setVehicles(vehicles.filter((v) => v._id !== selectedVehicle._id));
        setSelectedVehicle(null);
        setTakeOffDate("");
        setShowPaymentForm(false);
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment processing failed");
    }
  };

  // Validate Payment Details
  const validatePaymentDetails = () => {
    const { cardNumber, expiry, cvc, name } = paymentDetails;
    return (
      cardNumber.length === 16 &&
      expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/) &&
      cvc.length === 3 &&
      name.trim() !== ""
    );
  };

  // Simulate Payment Processing
  const processPayment = async (paymentDetails) => {
    // Replace this with actual payment gateway integration
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // No Vehicles Available State
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Available Vehicles</h2>
            <p className="text-gray-600 mb-4">All our vehicles are currently reserved. Please check back later.</p>
            <button
              onClick={fetchVehicles}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <FiRefreshCw className="inline-block" /> Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Reservation</h1>
            <button
              onClick={fetchVehicles}
              className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
              title="Refresh vehicles"
            >
              <FiRefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vehicle Selection and Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Vehicle</label>
                <select
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  onChange={(e) => setSelectedVehicle(vehicles.find((v) => v._id === e.target.value))}
                  value={selectedVehicle?._id || ""}
                >
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.name} - {vehicle.pickupPoint} → {vehicle.dropPoint}
                    </option>
                  ))}
                </select>
              </div>

              {selectedVehicle && (
                <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={`${selectedVehicle.image}`}
                      alt={selectedVehicle.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = "/default-vehicle.jpg")}
                    />
                  </div>

                  <div className="space-y-2">
                    <DetailItem label="Pickup Location" value={selectedVehicle.pickupPoint} />
                    <DetailItem label="Drop Location" value={selectedVehicle.dropPoint} />
                    <DetailItem label="Price" value={`Rs. ${selectedVehicle.price}`} />
                    <DetailItem label="Capacity" value={`${selectedVehicle.capacity} seats`} />
                    <DetailItem
                      label="Scheduled Departure"
                      value={new Date(selectedVehicle.takeOffDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Reservation and Payment Section */}
            <div className="space-y-6">
              {!showPaymentForm ? (
                // Reservation Form
                <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-100">
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
                      onClick={handleReservationConfirmation}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      Proceed to Payment
                      <FiArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                // Payment Form
                <PaymentForm
                  paymentDetails={paymentDetails}
                  setPaymentDetails={setPaymentDetails}
                  onCancel={() => setShowPaymentForm(false)}
                  onSubmit={handlePayment}
                />
              )}

              {/* Payment Summary */}
              {selectedVehicle && !showPaymentForm && (
                <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Payment Summary</h4>
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

// Payment Form Component
const PaymentForm = ({ paymentDetails, setPaymentDetails, onCancel, onSubmit }) => (
  <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-100">
    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
      <FiCreditCard className="w-5 h-5" /> Payment Details
    </h3>

    <div className="space-y-4">
      <PaymentInput
        label="Card Number"
        type="text"
        placeholder="4242 4242 4242 4242"
        value={paymentDetails.cardNumber}
        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
        maxLength={16}
      />

      <div className="grid grid-cols-2 gap-4">
        <PaymentInput
          label="Expiry Date"
          type="text"
          placeholder="MM/YY"
          value={paymentDetails.expiry}
          onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
          maxLength={5}
        />
        <PaymentInput
          label="CVC"
          type="text"
          placeholder="123"
          value={paymentDetails.cvc}
          onChange={(e) => setPaymentDetails({ ...paymentDetails, cvc: e.target.value })}
          maxLength={3}
        />
      </div>

      <PaymentInput
        label="Cardholder Name"
        type="text"
        placeholder="John Doe"
        value={paymentDetails.name}
        onChange={(e) => setPaymentDetails({ ...paymentDetails, name: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onCancel}
          className="w-full bg-gray-500 text-white py-3 px-6 rounded-xl hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          Confirm Payment
          <FiCreditCard className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

// Reusable Payment Input Component
const PaymentInput = ({ label, type, placeholder, value, onChange, maxLength }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
    />
  </div>
);

// Detail Item Component
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-900 font-semibold">{value}</span>
  </div>
);

// Summary Item Component
const SummaryItem = ({ label, value, isTotal }) => (
  <div className="flex justify-between items-center">
    <span className={`text-gray-600 ${isTotal ? "font-semibold" : ""}`}>{label}</span>
    <span className={`text-gray-900 ${isTotal ? "text-xl font-bold" : "font-medium"}`}>
      Rs. {typeof value === "number" ? value.toFixed(2) : value}
    </span>
  </div>
);

export default VehicleReservation;