import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBus,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaTag,
  FaCalendarAlt,
  FaChair,
  FaRegClock,
  FaQrcode,
} from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { motion } from "framer-motion";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `http://localhost:3001/api/refunds/history/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Failed to load booking history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const Ticket = ({ booking }) => {
    const isBus = !!booking.busId;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900 rounded-2xl shadow-lg border border-slate-700 overflow-hidden"
      >
        <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6">
          {/* Trip Info */}
          <div className="space-y-4 border-r border-slate-700 pr-6">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-3 rounded-lg">
                {isBus ? (
                  <FaBus className="text-2xl text-blue-400" />
                ) : (
                  <FaTicketAlt className="text-2xl text-yellow-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isBus
                    ? booking.busId?.name
                    : booking.vehicleId?.name || "Reserved Vehicle"}
                </h2>
                <p className="text-slate-400 text-sm">
                  Booking ID: {booking._id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-slate-400" />
                <div>
                  <p className="text-white font-medium">
                    {isBus ? booking.busId?.pickupPoint : booking.pickupPoint || "N/A"}
                  </p>
                  <p className="text-sm text-slate-400">Departure</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-slate-400" />
                <div>
                  <p className="text-white font-medium">
                    {isBus ? booking.busId?.dropPoint : booking.dropPoint || "N/A"}
                  </p>
                  <p className="text-sm text-slate-400">Destination</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seats and Payment */}
          <div className="space-y-4 border-r border-slate-700 pr-6">
            <div className="flex items-center gap-4">
              <FaChair className="text-xl text-green-400" />
              <div>
                <h3 className="text-white font-semibold">Seats</h3>
                <p className="text-slate-300">
                  {booking.selectedSeats?.length > 0
                    ? booking.selectedSeats.join(", ")
                    : isBus
                    ? "Not specified"
                    : "Full Reserved"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaTag className="text-xl text-purple-400" />
              <div>
                <h3 className="text-white font-semibold">Total Paid</h3>
                <p className="text-white font-bold text-xl">₹{booking.totalPrice}</p>
              </div>
            </div>
          </div>

          {/* Status & Date */}
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <span
                className={`w-fit px-4 py-1 rounded-full text-sm font-semibold ${
                  booking.status === "Booked"
                    ? "bg-green-900/30 text-green-400"
                    : "bg-red-900/30 text-red-400"
                }`}
              >
                {booking.status}
              </span>
              <div className="text-sm text-slate-400 flex items-center gap-2">
                <FaRegClock />
                {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800 p-4 border-t border-slate-700 text-sm text-slate-400 flex items-center gap-2">
          <FaCalendarAlt />
          <span>
            Departure:{" "}
            {new Date(
              booking.takeOffDate ||
                booking.reservationDate ||
                booking.busId?.departureTime
            ).toLocaleString()}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-6 flex items-center gap-3">
          <FaQrcode className="text-black" /> Booking History
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <ImSpinner8 className="text-4xl text-blue-400 animate-spin mb-4" />
            <p className="text-slate-500 text-lg">Loading your history...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-6 rounded-lg text-red-600">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-slate-600 mt-20">No past bookings found</div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Ticket key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
