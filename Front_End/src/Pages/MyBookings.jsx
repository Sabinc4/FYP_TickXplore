import React, { useEffect, useRef, useState } from "react";
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
  FaDownload,
  FaTrash,
} from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/refunds/upcoming/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId || !token) {
      setError("User not logged in.");
      setLoading(false);
    } else {
      fetchBookings();
    }
  }, [userId, token]);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/bookings/${id}`);
      fetchBookings(); // refresh list
    } catch (err) {
      console.error("Cancel Error:", err);
      alert("Failed to cancel booking.");
    }
  };

  const Ticket = ({ booking }) => {
    const isBus = !!booking.busId;

    const handleDownloadPDF = () => {
      setDownloading(true);
      
      // Create a new div for PDF generation
      const element = document.createElement('div');
      element.style.width = '600px';
      element.style.padding = '20px';
      element.style.backgroundColor = '#0f172a';
      element.style.color = '#ffffff';
      element.style.borderRadius = '12px';
      element.style.fontFamily = 'Arial, sans-serif';

      // Ticket content
      element.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">Travel Ticket</h2>
          <p style="color: #94a3b8;">Booking Confirmation</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <p style="color: #94a3b8; font-size: 14px;">Booking ID</p>
            <p style="font-size: 16px;">${booking._id.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <p style="color: #94a3b8; font-size: 14px;">${isBus ? 'Bus' : 'Vehicle'} Name</p>
            <p style="font-size: 16px; font-weight: bold;">
              ${isBus ? booking.busId?.name : booking.vehicleId?.name || "N/A"}
            </p>
          </div>
          <div>
            <p style="color: #94a3b8; font-size: 14px;">Total Paid</p>
            <p style="font-size: 18px; font-weight: bold; color: #a78bfa;">₹${booking.totalPrice}</p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <p style="color: #94a3b8; font-size: 14px;">Departure</p>
            <p style="font-size: 16px; font-weight: bold;">
              ${isBus ? booking.busId?.pickupPoint : booking.pickupPoint || "N/A"}
            </p>
          </div>
          <div>
            <p style="color: #94a3b8; font-size: 14px;">Destination</p>
            <p style="font-size: 16px; font-weight: bold;">
              ${isBus ? booking.busId?.dropPoint : booking.dropPoint || "N/A"}
            </p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <p style="color: #94a3b8; font-size: 14px;">Seats</p>
            <p style="font-size: 16px;">
              ${booking.selectedSeats?.length > 0 ? booking.selectedSeats.join(", ") : "N/A"}
            </p>
          </div>
          <div>
            <p style="color: #94a3b8; font-size: 14px;">Departure Time</p>
            <p style="font-size: 16px;">
              ${new Date(
                booking.takeOffDate || booking.reservationDate || booking.busId?.departureTime
              ).toLocaleString()}
            </p>
          </div>
        </div>

        <div style="border-top: 1px solid #334155; padding-top: 15px; text-align: center; color: #94a3b8;">
          Thank you for choosing our service
        </div>
      `;

      // Append to body temporarily
      document.body.appendChild(element);

      // Generate PDF
      setTimeout(() => {
        const opt = {
          margin: 10,
          filename: `ticket-${booking._id.slice(-6)}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { 
            scale: 2,
            logging: true,
            useCORS: true,
            scrollY: 0,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        html2pdf()
          .set(opt)
          .from(element)
          .save()
          .then(() => {
            setDownloading(false);
            document.body.removeChild(element);
          })
          .catch((err) => {
            console.error("PDF generation error:", err);
            setDownloading(false);
            document.body.removeChild(element);
          });
      }, 300);
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="ticket-container bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden border border-slate-600"
      >
        <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6">
          {/* Left Column - Trip Info */}
          <div className="space-y-4 border-r border-slate-600 pr-6">
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
                    {isBus
                      ? booking.busId?.pickupPoint
                      : booking.pickupPoint || "N/A"}
                  </p>
                  <p className="text-sm text-slate-400">Departure</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-slate-400" />
                <div>
                  <p className="text-white font-medium">
                    {isBus
                      ? booking.busId?.dropPoint
                      : booking.dropPoint || "N/A"}
                  </p>
                  <p className="text-sm text-slate-400">Destination</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Seats and Payment */}
          <div className="space-y-4 border-r border-slate-400 pr-6">
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
                <p className="text-white font-bold text-xl">
                  ₹{booking.totalPrice}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Status and Actions */}
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
            <span
              className={`w-fit px-4 py-1 rounded-full text-sm font-semibold ${
                booking.status === "Booked"
                  ? "bg-green-900/30 text-green-400"
                  : booking.status === "CashOnVisit"
                  ? "bg-yellow-900/30 text-yellow-400"
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

            <div className="flex flex-col gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <ImSpinner8 className="animate-spin" />
                ) : (
                  <>
                    <FaDownload /> Download Ticket
                  </>
                )}
              </button>
              <button
                onClick={() => handleCancel(booking._id)}
                className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 flex items-center justify-center gap-2"
              >
                <FaTrash /> Cancel Booking
              </button>
            </div>
          </div>
        </div>

        {/* Footer - Departure Date */}
        <div className="bg-slate-800 p-4 border-t border-slate-600 text-sm text-slate-400 flex items-center gap-2">
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

  const busBookings = bookings.filter((b) => b.busId);
  const vehicleBookings = bookings.filter((b) => b.vehicleId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-6 flex items-center gap-3">
          <FaQrcode className="text-black" />
          My Travel Reservations
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <ImSpinner8 className="text-4xl text-blue-400 animate-spin mb-4" />
            <p className="text-slate-300 text-lg">Fetching your bookings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 p-6 rounded-lg text-red-300">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-white mt-20">No bookings found</div>
        ) : (
          <>
            {busBookings.length > 0 && (
              <>
                <h2 className="text-xl text-black font-bold my-4">Bus Bookings</h2>
                <div className="grid gap-6">
                  {busBookings.map((booking) => (
                    <Ticket key={booking._id} booking={booking} />
                  ))}
                </div>
              </>
            )}

            {vehicleBookings.length > 0 && (
              <>
                <h2 className="text-xl text-black font-bold mt-10 mb-4">
                  Vehicle Reservations
                </h2>
                <div className="grid gap-6">
                  {vehicleBookings.map((booking) => (
                    <Ticket key={booking._id} booking={booking} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;