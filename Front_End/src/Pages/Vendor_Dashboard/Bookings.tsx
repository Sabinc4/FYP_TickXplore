import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { getPageRange } from "../../utils/pagination";
import { bookingsApi, type Booking, type BookingRef } from "../../api";

interface OutletContext {
  bookings: Booking[];
  fetchData: () => void;
}

const PAGE_SIZE = 10;

const statusBadge = (status: string) =>
  status === "Booked"
    ? "bg-green-100 text-green-800"
    : status === "Pending"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

const isCoD = (booking: Booking) =>
  booking.paymentMethod === "CashOnVisit" || booking.paymentStatus === "CashOnVisit";

const isCoDPending = (booking: Booking) =>
  booking.status === "Pending" && isCoD(booking);

const Bookings = () => {
  const { bookings, fetchData } = useOutletContext<OutletContext>();
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleConfirm = async (id: string) => {
    if (!window.confirm("Confirm payment for this Cash on Visit booking?")) return;
    setConfirmingId(id);
    try {
      await bookingsApi.confirmBooking(id);
      toast.success("Booking confirmed.");
      fetchData();
    } catch (err) {
      console.error("Confirm booking error:", err);
      toast.error("Failed to confirm booking.");
    } finally {
      setConfirmingId(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (!dateFilter || !booking.createdAt) return true;
    const bookingDay = new Date(booking.createdAt).toLocaleDateString("en-CA");
    return bookingDay === dateFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pagedBookings = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredBookings.slice(start, start + PAGE_SIZE);
  }, [filteredBookings, safePage]);

  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredBookings.length);

  return (
    <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Bookings</h2>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300 text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Booking ID</th>
              <th className="px-6 py-3 text-left font-semibold">User</th>
              <th className="px-6 py-3 text-left font-semibold">Bus</th>
              <th className="px-6 py-3 text-left font-semibold">Seats</th>
              <th className="px-6 py-3 text-left font-semibold">Price</th>
              <th className="px-6 py-3 text-left font-semibold">Commission</th>
              <th className="px-6 py-3 text-left font-semibold">Vendor Earnings</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {pagedBookings.map((booking) => {
              const user = booking.userId as { name?: string } | undefined;
              const busRef = booking.busId as BookingRef | undefined;
              const vehicleRef = booking.vehicleId as BookingRef | undefined;
              return (
                <tr key={booking._id}>
                  <td className="break-words px-6 py-4 text-justify font-medium text-gray-900">{booking._id}</td>
                  <td className="break-words px-6 py-4 text-justify">{user?.name || "N/A"}</td>
                  <td className="break-words px-6 py-4 text-justify">{busRef?.name || vehicleRef?.name || "N/A"}</td>
                  <td className="break-words px-6 py-4 text-justify">{booking.selectedSeats?.join(", ") || "N/A"}</td>
                  <td className="break-words px-6 py-4 text-justify">NPR {booking.totalPrice?.toFixed(2) || "0.00"}</td>
                  <td className="break-words px-6 py-4 text-justify">
                    NPR {booking.commissionAmount?.toFixed(2) || "0.00"}
                  </td>
                  <td className="break-words px-6 py-4 text-justify">
                    NPR {booking.vendorEarnings?.toFixed(2) || "0.00"}
                  </td>
                  <td className="break-words px-6 py-4 text-justify">
                    <div className="flex flex-col items-start gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                      {isCoD(booking) && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                          Cash on Visit
                        </span>
                      )}
                      {isCoDPending(booking) && (
                        <button
                          onClick={() => handleConfirm(booking._id)}
                          disabled={confirmingId === booking._id}
                          className="mt-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {confirmingId === booking._id ? "Confirming..." : "Confirm Payment"}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="break-words px-6 py-4 text-justify">
                    {booking.createdAt
                      ? new Date(booking.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredBookings.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No bookings found.</p>
        )}
      </div>

      {filteredBookings.length > PAGE_SIZE && (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1}-{endIndex} of {filteredBookings.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            {getPageRange(safePage, totalPages).map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-2 py-1 text-sm text-gray-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`rounded-md px-3 py-1 text-sm transition-colors ${
                    p === safePage
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;