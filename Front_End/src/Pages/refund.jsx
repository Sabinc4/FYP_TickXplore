import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaQrcode, FaCalendarAlt, FaTag } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

const Refunds = () => {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userId) fetchBookings();
  }, [userId]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/bookings/upcoming/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUpcomingBookings(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch upcoming bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!reason.trim()) return toast.error("Please enter a refund reason.");

    try {
      await axios.put(
        `http://localhost:3001/api/bookings/cancel/${selectedBooking._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8 flex items-center gap-3">
          <FaQrcode className="text-black" />
          Refund Requests
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <ImSpinner8 className="text-4xl text-blue-400 animate-spin mb-4" />
            <p className="text-slate-500 text-lg">Loading your bookings...</p>
          </div>
        ) : !selectedBooking ? (
          <>
            {upcomingBookings.length === 0 ? (
              <p className="text-center text-slate-500">No bookings eligible for refund.</p>
            ) : (
              <div className="grid gap-6">
                {upcomingBookings.map((booking) => {
                  const isBus = !!booking.busId;
                  return (
                    <div
                      key={booking._id}
                      className="bg-slate-900 text-white border border-slate-700 rounded-xl p-6 shadow-lg"
                    >
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                        <div className="space-y-2">
                          <h2 className="text-lg font-bold">{isBus ? booking.busId?.name : booking.vehicleId?.name}</h2>
                          <p className="text-sm text-slate-400">Booking ID: {booking._id.slice(-8).toUpperCase()}</p>
                          <p className="flex items-center gap-2 text-slate-400">
                            <FaCalendarAlt /> {new Date(booking.takeOffDate || booking.reservationDate).toLocaleString()}
                          </p>
                          <p className="flex items-center gap-2 text-slate-400">
                            <FaTag /> ₹{booking.totalPrice}
                          </p>
                        </div>
                        <div className="md:text-right">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="bg-blue-700 hover:bg-blue-800 transition px-4 py-2 rounded text-white font-medium"
                          >
                            Request Refund
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="bg-slate-900 text-white border border-slate-700 rounded-xl p-6 shadow-xl w-full max-w-xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Submit Refund Request</h3>
            <textarea
              className="w-full h-32 p-3 bg-slate-800 border border-slate-600 rounded text-white placeholder-slate-400 resize-none"
              placeholder="Please enter your reason for requesting a refund..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setReason("");
                }}
                className="bg-slate-700 hover:bg-slate-600 transition px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                className="bg-blue-700 hover:bg-blue-800 transition px-4 py-2 rounded text-white"
              >
                Submit Refund
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Refunds;
