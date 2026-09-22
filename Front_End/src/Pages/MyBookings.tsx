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
  FaDownload,
  FaTrash,
} from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
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

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchBookings = useCallback(async () => {
    try {
      const data = await refundsApi.getUpcoming(userId || "");
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token]);

  useEffect(() => {
    if (!userId || !token) {
      setError("User not logged in.");
      setLoading(false);
    } else {
      fetchBookings();
    }
  }, [userId, token, fetchBookings]);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await refundsApi.cancel(id);
      toast.success("Booking cancelled.");
      fetchBookings();
    } catch (err) {
      console.error("Cancel Error:", err);
      toast.error("Failed to cancel booking.");
    }
  };

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

    const handleDownloadPDF = () => {
      setDownloading(true);

      const element = document.createElement("div");
      element.style.width = "600px";
      element.style.padding = "20px";
      element.style.backgroundColor = "#0f172a";
      element.style.color = "#ffffff";
      element.style.borderRadius = "12px";
      element.style.fontFamily = "Arial, sans-serif";

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
            <p style="color: #94a3b8; font-size: 14px;">${isBus ? "Bus" : "Vehicle"} Name</p>
            <p style="font-size: 16px; font-weight: bold;">${refName(
              isBus ? booking.busId : booking.vehicleId
            )}</p>
          </div>
          <div>
            <p style="color: #94a3b8; font-size: 14px;">Total Paid</p>
            <p style="font-size: 18px; font-weight: bold; color: #a78bfa;">NPR ${booking.totalPrice}</p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <p style="color: #94a3b8; font-size: 14px;">Departure</p>
            <p style="font-size: 16px; font-weight: bold;">
              ${isBus ? refPoint(booking.busId, "pickupPoint") : booking.pickupPoint || "N/A"}
            </p>
          </div>
          <div>
            <p style="color: #94a3b8; font-size: 14px;">Destination</p>
            <p style="font-size: 16px; font-weight: bold;">
              ${isBus ? refPoint(booking.busId, "dropPoint") : booking.dropPoint || "N/A"}
            </p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <p style="color: #94a3b8; font-size: 14px;">Seats</p>
            <p style="font-size: 16px;">
              ${booking.selectedSeats?.length ? booking.selectedSeats.join(", ") : "N/A"}
            </p>
          </div>
          <div>
            <p style="color: #94a3b8; font-size: 14px;">Departure Time</p>
            <p style="font-size: 16px;">${departDate}</p>
          </div>
        </div>

        <div style="border-top: 1px solid #334155; padding-top: 15px; text-align: center; color: #94a3b8;">
          Thank you for choosing our service
        </div>
      `;

      document.body.appendChild(element);

      window.setTimeout(() => {
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
            windowHeight: element.scrollHeight,
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
          .catch((err: unknown) => {
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
        className="overflow-hidden rounded-2xl border border-slate-600 bg-slate-900 shadow-card transition hover:shadow-card-lg"
      >
        <div className="grid gap-6 p-6 md:grid-cols-3 md:p-8">
          <div className="space-y-4 border-slate-600 pr-6 md:border-r">
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

          <div className="space-y-4 border-slate-400 pr-6 md:border-r">
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
                  ? "Pending (Cash on Visit)"
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

            <div className="flex flex-col gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-2 text-white transition-colors hover:bg-blue-900"
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
                className="flex items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-white transition-colors hover:bg-red-800"
              >
                <FaTrash /> Cancel Booking
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-600 bg-slate-800 p-4 text-sm text-slate-400">
          <FaCalendarAlt />
          <span>Departure: {departDate}</span>
        </div>
      </motion.div>
    );
  };

  const busBookings = bookings.filter((b) => b.busId);
  const vehicleBookings = bookings.filter((b) => b.vehicleId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 sm:text-4xl">
          <FaQrcode className="text-slate-900" />
          My Travel Reservations
        </h1>

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center">
            <ImSpinner8 className="mb-4 animate-spin text-4xl text-blue-500" />
            <p className="text-lg text-slate-500">Fetching your bookings...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-6 text-red-600">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="mt-20 text-center text-slate-500">No bookings found</div>
        ) : (
          <>
            {busBookings.length > 0 && (
              <>
                <h2 className="my-4 text-xl font-bold text-slate-900">Bus Bookings</h2>
                <div className="grid gap-6">
                  {busBookings.map((booking) => (
                    <Ticket key={booking._id} booking={booking} />
                  ))}
                </div>
              </>
            )}

            {vehicleBookings.length > 0 && (
              <>
                <h2 className="mt-10 mb-4 text-xl font-bold text-slate-900">
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