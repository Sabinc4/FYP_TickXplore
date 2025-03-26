import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { busId, seats, totalPrice } = location.state || {};

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!busId || !seats || seats.length === 0 || !totalPrice) {
      toast.error("Invalid payment details. Redirecting...");
      navigate("/");
    }
  }, [busId, seats, totalPrice, navigate]);

  const handlePayment = async () => {
    setLoading(true);
  
    try {
      const userId = localStorage.getItem("userId");
  
      if (!userId) {
        toast.error("User not logged in.");
        setLoading(false);
        return;
      }
  
      const response = await axios.post("http://localhost:3001/api/payments/initiate", {
        type: "bus",
        itemId: busId,
        userInfo: {
          name: "John Doe", // Replace with actual user info
          email: "john@example.com",
          phone: "9800000000"
        },
        seats: seats,
        userId,
      });
  
      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        toast.error("No payment URL received.");
      }
  
    } catch (err) {
      console.error("Payment Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Confirm Your Payment</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <p className="text-lg text-gray-700 mb-3">Seats Selected: {seats.join(", ")}</p>
        <p className="text-lg text-gray-700 mb-3">Total Price: Rs. {totalPrice}</p>
        <button
          onClick={handlePayment}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-lg font-semibold mt-4"
          disabled={loading}
        >
          {loading ? <ClipLoader color="#fff" size={20} /> : "Proceed to Khalti Payment"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
