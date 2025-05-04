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
      const res = await axios.get(`http://localhost:3001/api/refunds/upcoming/${userId}`, {
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
        `http://localhost:3001/api/refunds/cancel/${selectedBooking._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.post(
        `http://localhost:3001/api/refunds/refund/${selectedBooking._id}`,
        {
          refundAmount: selectedBooking.totalPrice,
          reason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
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
    <div className="min-h-screen bg-[#f0f4f8] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
          <FaQrcode className="text-black" />
          Refunds
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
                  const title = isBus ? booking.busId?.name : booking.vehicleId?.name;
                  const takeOff = new Date(booking.takeOffDate || booking.reservationDate).toLocaleString();

                  return (
                    <div
                      key={booking._id}
                      className="bg-slate-900 text-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700"
                    >
                      <div className="space-y-1">
                        <h2 className="text-xl font-bold">{title}</h2>
                        <p className="text-sm text-slate-400">Booking ID: {booking._id.slice(-8).toUpperCase()}</p>
                        <p className="text-slate-400">Seats: {booking.selectedSeats?.join(", ") || "N/A"}</p>
                        <p className="text-slate-400">Total Paid: ₹{booking.totalPrice}</p>
                        <p className="text-slate-400">
                          Departure: {takeOff}
                        </p>
                      </div>
                      <div className="flex flex-col md:items-end">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="bg-blue-700 hover:bg-blue-800 transition px-4 py-2 rounded-md text-white font-medium"
                        >
                          Request Refund
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Submit Refund Request</h3>
            <textarea
              className="w-full h-32 bg-slate-800 border border-slate-600 rounded-lg p-3 placeholder-slate-400 text-white resize-none"
              placeholder="Enter your reason for requesting a refund..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setReason("");
                }}
                className="bg-slate-700 hover:bg-slate-600 transition px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                className="bg-blue-700 hover:bg-blue-800 transition px-4 py-2 rounded-md"
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
