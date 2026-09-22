import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { bookingsApi } from "../api";

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Processing...");
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pidx = queryParams.get("pidx");
    const paymentStatus = queryParams.get("status");

    if (!pidx || paymentStatus !== "Completed") {
      setStatus("Payment Failed. Redirecting to homepage...");
      setSuccess(false);
      window.setTimeout(() => navigate("/"), 3000);
      return;
    }

    bookingsApi
      .verifyPayment({ pidx })
      .then(() => {
        setSuccess(true);
        setStatus("Payment Successful! Redirecting to My Bookings...");
        window.setTimeout(() => navigate("/my-bookings"), 3000);
      })
      .catch((err) => {
        console.error("Payment Verification Error:", err.response?.data || err.message);
        setSuccess(false);
        setStatus("Payment Failed. Please contact support.");
        window.setTimeout(() => navigate("/"), 3000);
      })
      .finally(() => setLoading(false));
  }, [location, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50 px-4">
      <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 text-center shadow-card-lg">
        {loading ? (
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
        ) : success ? (
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        ) : (
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
        )}
        <h2 className="text-xl font-semibold text-slate-900">{status}</h2>
        <p className="text-sm text-slate-500">
          You will be redirected automatically in a few seconds.
        </p>
      </div>
    </div>
  );
};

export default PaymentCallback;