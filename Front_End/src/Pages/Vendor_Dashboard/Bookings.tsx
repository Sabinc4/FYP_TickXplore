import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaMoneyBillWave,
  FaHandHoldingUsd,
  FaWallet,
  FaTicketAlt,
} from "react-icons/fa";
import { getPageRange } from "../../utils/pagination";
import AdminPageHeader from "../../Component/Admin Component/AdminPageHeader";
import { bookingsApi, type Booking, type BookingRef } from "../../api";

interface OutletContext {
  bookings: Booking[];
  fetchData: () => void;
}

const PAGE_SIZE = 10;

const statusPill = (status: string) =>
  status === "Booked"
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
    : status === "Pending"
    ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
    : "border-rose-500/30 bg-rose-500/10 text-rose-600";

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

  const stats = useMemo(
    () => ({
      revenue: bookings.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0),
      commission: bookings.reduce((sum, b) => sum + (Number(b.commissionAmount) || 0), 0),
      earnings: bookings.reduce((sum, b) => sum + (Number(b.vendorEarnings) || 0), 0),
      booked: bookings.filter((b) => b.status === "Booked").length,
      pending: bookings.filter((b) => b.status === "Pending").length,
      cod: bookings.filter(isCoD).length,
    }),
    [bookings]
  );

  const money = (value: number | undefined) =>
    `NPR ${(Number(value) || 0).toFixed(2)}`;

  const statCards = [
    {
      label: "Total Revenue",
      value: money(stats.revenue),
      icon: <FaMoneyBillWave />,
      accent: "bg-emerald-500/10 text-emerald-700",
    },
    {
      label: "Commission",
      value: money(stats.commission),
      icon: <FaHandHoldingUsd />,
      accent: "bg-amber-500/10 text-amber-700",
    },
    {
      label: "Vendor Earnings",
      value: money(stats.earnings),
      icon: <FaWallet />,
      accent: "bg-indigo-500/10 text-indigo-700",
    },
    {
      label: "Bookings",
      value: String(bookings.length),
      icon: <FaTicketAlt />,
      accent: "bg-violet-500/10 text-violet-700",
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Payment Management"
        subtitle="Track revenue, commissions and vendor earnings, and confirm Cash on Visit bookings."
      >
        <span className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-indigo-700 shadow">
          {stats.booked} booked · {stats.pending} pending · {stats.cod} cash on visit
        </span>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl bg-white p-5 shadow-card transition-shadow hover:shadow-card-lg"
          >
            <div className="flex items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.accent}`}>
                {card.icon}
              </span>
              <span className="text-xs font-medium text-gray-500">{card.label}</span>
            </div>
            <p className="mt-2 truncate text-lg font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-slate-900">Bookings</h2>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-xl border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter("")}
                className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="px-4 py-3 text-left font-semibold">Booking ID</th>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">Bus / Vehicle</th>
                <th className="px-4 py-3 text-left font-semibold">Seats</th>
                <th className="px-4 py-3 text-right font-semibold">Price</th>
                <th className="px-4 py-3 text-right font-semibold">Commission</th>
                <th className="px-4 py-3 text-right font-semibold">Vendor Earnings</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {pagedBookings.map((booking) => {
                const user = booking.userId as { name?: string } | undefined;
                const busRef = booking.busId as BookingRef | undefined;
                const vehicleRef = booking.vehicleId as BookingRef | undefined;
                return (
                  <tr key={booking._id} className="transition-colors hover:bg-slate-50">
                    <td
                      className="px-4 py-3 font-mono text-xs font-semibold text-slate-600"
                      title={booking._id}
                    >
                      #{booking._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {user?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {busRef?.name || vehicleRef?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {booking.selectedSeats?.join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-indigo-700">
                      {money(booking.totalPrice)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {money(booking.commissionAmount)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700">
                      {money(booking.vendorEarnings)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-start gap-1.5">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusPill(
                            booking.status || ""
                          )}`}
                        >
                          {booking.status || "Unknown"}
                        </span>
                        {isCoD(booking) && (
                          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                            Cash on Visit
                          </span>
                        )}
                        {isCoDPending(booking) && (
                          <button
                            onClick={() => handleConfirm(booking._id)}
                            disabled={confirmingId === booking._id}
                            className="mt-0.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {confirmingId === booking._id ? "Confirming..." : "Confirm Payment"}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
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
            <p className="py-8 text-center text-gray-500">No bookings found.</p>
          )}
        </div>

        {filteredBookings.length > PAGE_SIZE && (
          <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1}-{endIndex} of {filteredBookings.length}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              {getPageRange(safePage, totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-2 py-1 text-sm text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`rounded-lg px-3 py-1 text-sm transition-colors ${
                      p === safePage
                        ? "bg-indigo-600 text-white"
                        : "border border-gray-300 text-gray-600 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;