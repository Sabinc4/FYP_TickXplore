import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Refunds = () => {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reason, setReason] = useState("");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/bookings/upcoming/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUpcomingBookings(res.data.bookings || []);
    } catch (error) {
      toast.error("Failed to fetch upcoming bookings");
    }
  };

  const handleRefund = async () => {
    if (!reason.trim()) return toast.error("Please enter a refund reason.");

    try {
      // Step 1: Cancel booking first
      await axios.put(`http://localhost:3001/api/bookings/cancel/${selectedBooking._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Step 2: Trigger refund
      await axios.post(
        `http://localhost:3001/api/bookings/refund/${selectedBooking._id}`,
        {
          refundAmount: selectedBooking.totalPrice,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Refund processed successfully.");
      setSelectedBooking(null);
      setReason("");
      fetchBookings();
    } catch (error) {
      const msg = error.response?.data?.message || "Refund failed.";
      toast.error(msg);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto min-h-screen bg-slate-200">
      <h2 className="text-xl font-bold mb-6 text-center text-slate-800">Refund Requests</h2>

      {/* Step 1: Show bookings */}
      {!selectedBooking ? (
        <>
          {upcomingBookings.length === 0 ? (
            <p className="text-slate-600 text-center">No upcoming bookings eligible for refund.</p>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="border border-slate-300 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-800 text-slate-100"
                >
                  <div className="space-y-1">
                    <p><strong>ID:</strong> {booking._id}</p>
                    <p><strong>Date:</strong> {new Date(booking.takeOffDate).toLocaleDateString()}</p>
                    <p><strong>Amount:</strong> ₹{booking.totalPrice}</p>
                  </div>
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="bg-blue-600 text-white px-4 py-2 mt-4 sm:mt-0 rounded hover:bg-blue-700 transition-colors"
                  >
                    Request Refund
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        // Step 2: Refund Reason Form
        <div className="bg-slate-800 shadow-lg rounded p-6 w-full max-w-md mx-auto text-slate-100">
          <h3 className="text-lg font-semibold mb-3">Request Refund</h3>
          <textarea
            className="w-full border border-slate-600 rounded p-2 h-32 bg-slate-700 text-slate-100"
            placeholder="Explain your reason for requesting a refund..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => {
                setSelectedBooking(null);
                setReason("");
              }}
              className="bg-slate-600 text-slate-100 px-4 py-2 rounded hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRefund}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Refunds;