import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Processing...");
  const [success, setSuccess] = useState(null); // true = success, false = fail

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pidx = queryParams.get("pidx");
    const paymentStatus = queryParams.get("status");

    if (!pidx || paymentStatus !== "Completed") {
      setStatus("Payment Failed. Redirecting to homepage...");
      setSuccess(false);
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    axios
      .post("http://localhost:3001/api/payments/verify", { pidx })
      .then(() => {
        setSuccess(true);
        setStatus("Payment Successful! Redirecting to My Bookings...");
        setTimeout(() => navigate("/my-bookings"), 3000);
      })
      .catch((err) => {
        console.error("Payment Verification Error:", err.response?.data || err.message);
        setSuccess(false);
        setStatus("Payment Failed. Please contact support.");
        setTimeout(() => navigate("/"), 3000);
      })
      .finally(() => setLoading(false));
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center space-y-4">
        {loading ? (
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-500" />
        ) : success ? (
          <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
        ) : (
          <XCircle className="w-12 h-12 mx-auto text-red-500" />
        )}
        <h2 className="text-xl font-semibold">{status}</h2>
        <p className="text-sm text-gray-500">
          You will be redirected automatically in a few seconds.
        </p>
      </div>
    </div>
  );
};

export default PaymentCallback;
