import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pidx = queryParams.get("pidx");
    const paymentStatus = queryParams.get("status");

    if (!pidx || paymentStatus !== "Completed") {
      setStatus("Payment Failed");
      setTimeout(() => navigate("/"), 3000); // Redirect to homepage after 3 sec
      return;
    }

    // ✅ Verify payment with backend
    axios
      .post("http://localhost:3001/api/payments/verify", { pidx })
      .then((res) => {
        setStatus("Payment Successful! Redirecting...");
        setTimeout(() => navigate("/my-bookings"), 3000); // Redirect to booking history
      })
      .catch((err) => {
        setStatus("Payment Failed. Please contact support.");
        console.error("Payment Verification Error:", err.response?.data || err.message);
        setTimeout(() => navigate("/"), 3000);
      })
      .finally(() => setLoading(false));

  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold text-center">{status}</h2>
      </div>
    </div>
  );
};

export default PaymentCallback;
