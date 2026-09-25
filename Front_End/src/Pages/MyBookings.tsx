import { useEffect, useState, useCallback } from "react";
import { FaQrcode } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { toast } from "react-toastify";
import BookingTicket from "../Component/BookingTicket";
import { refundsApi, type Booking } from "../api";

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
                    <BookingTicket
                      key={booking._id}
                      booking={booking}
                      showCancel
                      onCancel={handleCancel}
                    />
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
                    <BookingTicket
                      key={booking._id}
                      booking={booking}
                      showCancel
                      onCancel={handleCancel}
                    />
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