import { useEffect, useState, useCallback } from "react";
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
import { refundsApi, type Booking } from "../api";

const refName = (ref: string | { name?: string } | undefined, fallback = "N/A") =>
  typeof ref === "object" && ref ? ref.name : fallback;

const refPoint = (ref: string | { pickupPoint?: string; dropPoint?: string } | undefined, key: "pickupPoint" | "dropPoint", fallback = "N/A") =>
  typeof ref === "object" && ref ? ref[key] || fallback : fallback;

// Same 4-per-row layout as the seat map in Seat_Selection (A1…J4, etc.)
const getSeatLabel = (seatNumber: number | string) => {
  const seat = Number(seatNumber);
  if (!Number.isFinite(seat) || seat <= 0) return String(seatNumber);
  const row = Math.floor((seat - 1) / 4);
  const col = ((seat - 1) % 4) + 1;
  return `${String.fromCharCode(65 + row)}${col}`;
};

const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    try {
      const data = await refundsApi.getHistory(userId);
      setBookings(data as Booking[]);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Failed to load booking history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const Ticket = ({ booking }: { booking: Booking }) => {
    const isBus = !!booking.busId;
    const isCoD =
      booking.paymentMethod === "CashOnVisit" || booking.paymentStatus === "CashOnVisit";
    const bookingRef = isBus ? booking.busId : booking.vehicleId;
    const depart = booking.takeOffDate || booking.reservationDate || "";
    const departTime =
      typeof bookingRef === "object" && bookingRef ? bookingRef.departureTime : undefined;
    const departDate = depart
      ? new Date(depart).toLocaleString()
      : departTime
      ? departTime
      : "N/A";

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-card"
      >
        <div className="grid gap-6 p-6 md:grid-cols-3 md:p-8">
          <div className="space-y-4 border-slate-700 pr-6 md:border-r">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-800 p-3">
                {isBus ? (
                  <FaBus className="text-2xl text-blue-400" />
                ) : (
                  <FaTicketAlt className="text-2xl text-amber-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {refName(isBus ? booking.busId : booking.vehicleId, "Reserved Vehicle")}
                </h2>
                <p className="text-sm text-slate-400">
                  Booking ID: {booking._id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-slate-400" />
                <div>
                  <p className="font-medium text-white">
                    {isBus ? refPoint(booking.busId, "pickupPoint") : booking.pickupPoint || "N/A"}
                  </p>
                  <p className="text-sm text-slate-400">Departure</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-slate-400" />
                <div>
                  <p className="font-medium text-white">
                    {isBus ? refPoint(booking.busId, "dropPoint") : booking.dropPoint || "N/A"}
                  </p>
                  <p className="text-sm text-slate-400">Destination</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-slate-700 pr-6 md:border-r">
            <div className="flex items-center gap-4">
              <FaChair className="text-xl text-emerald-400" />
              <div>
                <h3 className="font-semibold text-white">Seats</h3>
                <p className="text-slate-300">
                  {booking.selectedSeats?.length
                    ? booking.selectedSeats.map(getSeatLabel).join(", ")
                    : isBus
                    ? "Not specified"
                    : "Full Reserved"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaTag className="text-xl text-purple-400" />
              <div>
                <h3 className="font-semibold text-white">Total Paid</h3>
                <p className="text-xl font-bold text-white">NPR {booking.totalPrice}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <span
                className={`w-fit rounded-full px-4 py-1 text-sm font-semibold ${
                  isCoD
                    ? "bg-blue-900/30 text-blue-400"
                    : booking.status === "Booked"
                    ? "bg-green-900/30 text-green-400"
                    : "bg-red-900/30 text-red-400"
                }`}
              >
                {booking.status === "Booked"
                  ? isCoD
                    ? "Booked (Cash on Visit)"
                    : booking.status
                  : isCoD
                  ? `${booking.status} (Cash on Visit)`
                  : booking.status}
              </span>
              {booking.createdAt && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <FaRegClock />
                  {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-700 bg-slate-800 p-4 text-sm text-slate-400">
          <FaCalendarAlt />
          <span>Departure: {departDate}</span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 sm:text-4xl">
          <FaQrcode className="text-slate-900" /> Booking History
        </h1>

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center">
            <ImSpinner8 className="mb-4 animate-spin text-4xl text-blue-500" />
            <p className="text-lg text-slate-500">Loading your history...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-6 text-red-600">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="mt-20 text-center text-slate-500">No past bookings found</div>
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