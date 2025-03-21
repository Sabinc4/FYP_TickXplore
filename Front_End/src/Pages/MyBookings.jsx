import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBus, FaMapMarkerAlt, FaTicketAlt, FaTag, FaCalendarAlt } from "react-icons/fa";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId"); // ✅ Ensure correct user ID retrieval

  useEffect(() => {
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:3001/api/bookings/user/${userId}`)
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching bookings:", err);
        setError("Failed to load bookings.");
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="w-full max-w-4xl space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-md hover:shadow-lg rounded-lg p-6 transition-shadow duration-300 flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              {/* ✅ Booking Details (Without Image) */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FaBus className="text-blue-500" />{" "}
                  {booking.busId ? booking.busId.name : "Unknown Bus"}
                </h2>

                <p className="text-gray-600 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-500" /> Route:{" "}
                  {booking.busId
                    ? `${booking.busId.pickupPoint} → ${booking.busId.dropPoint}`
                    : "N/A"}
                </p>

                <p className="text-gray-600 mb-2 flex items-center gap-2">
                  <FaTicketAlt className="text-purple-500" /> Seats:{" "}
                  {booking.selectedSeats.length > 0
                    ? booking.selectedSeats.join(", ")
                    : "No Seats Selected"}
                </p>

                <p className="text-gray-600 mb-2 flex items-center gap-2">
                  <FaTag className="text-yellow-500" /> Price: Rs.{" "}
                  {booking.totalPrice}
                </p>

                <p
                  className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                    booking.status === "Booked"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  <FaTag className="text-current" /> Status: {booking.status}
                </p>

                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" /> Booking Date:{" "}
                  {new Date(booking.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
