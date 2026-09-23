import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaHandHoldingUsd,
  FaWallet,
  FaTicketAlt,
  FaSearch,
} from "react-icons/fa";
import { getPageRange } from "../../utils/pagination";
import type { Booking } from "../../api";

interface OutletContext {
  bookings: Booking[];
  loading: boolean;
  error: string;
}

const PAGE_SIZE = 10;

const isCoD = (booking: Booking) =>
  booking.paymentMethod === "CashOnVisit" || booking.paymentStatus === "CashOnVisit";

const statusPill = (status: string) =>
  status === "Booked"
    ? "border-teal-500/30 bg-teal-500/10 text-teal-700"
    : status === "Pending"
    ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
    : "border-rose-500/30 bg-rose-500/10 text-rose-600";

const Bookings = () => {
  const { bookings, loading, error } = useOutletContext<OutletContext>();
  const [bookingType, setBookingType] = useState<"bus" | "vehicle">("bus");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);

  const filteredBookings = bookings
    .filter((booking) => (bookingType === "bus" ? booking.bus : booking.vehicle))
    .filter((booking) => {
      const query = searchQuery.toLowerCase();
      return (
        booking._id.includes(searchQuery) ||
        booking.user?.name?.toLowerCase().includes(query) ||
        booking.bus?.name?.toLowerCase().includes(query) ||
        booking.vehicle?.name?.toLowerCase().includes(query)
      );
    })
    .filter((booking) => {
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

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

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

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Loading bookings...
      </div>
    );
  if (error)
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-600">
        Error loading bookings: {error}
      </div>
    );

  const money = (value: number | undefined) =>
    `NPR ${(Number(value) || 0).toFixed(2)}`;

  const statCards = [
    {
      label: "Total Revenue",
      value: money(stats.revenue),
      icon: <FaMoneyBillWave />,
      accent: "bg-teal-500/20 text-teal-200",
    },
    {
      label: "Commission",
      value: money(stats.commission),
      icon: <FaHandHoldingUsd />,
      accent: "bg-amber-500/20 text-amber-200",
    },
    {
      label: "Vendor Earnings",
      value: money(stats.earnings),
      icon: <FaWallet />,
      accent: "bg-blue-500/20 text-blue-200",
    },
    {
      label: "Bookings",
      value: String(bookings.length),
      icon: <FaTicketAlt />,
      accent: "bg-violet-500/20 text-violet-200",
    },
  ];

  return (
    <div className="space-y-6">
      <header className="overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-slate-900 p-6 text-white shadow-card">
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <p className="mt-1 text-sm text-teal-50/80">
          Track revenue, commissions and vendor earnings across all bookings.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-xl bg-white/10 p-4">
              <div className="flex items-center gap-2">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.accent}`}>
                  {card.icon}
                </span>
                <span className="text-xs font-medium text-teal-50/80">{card.label}</span>
              </div>
              <p className="mt-2 truncate text-lg font-bold">{card.value}</p>
              {card.label === "Bookings" && (
                <p className="mt-1 text-xs text-teal-50/70">
                  {stats.booked} booked · {stats.pending} pending · {stats.cod} cash on visit
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => setBookingType("bus")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              bookingType === "bus"
                ? "bg-white text-slate-900 shadow"
                : "bg-white/10 text-teal-50 hover:bg-white/20"
            }`}
          >
            Bus Bookings
          </button>
          <button
            onClick={() => setBookingType("vehicle")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              bookingType === "vehicle"
                ? "bg-white text-slate-900 shadow"
                : "bg-white/10 text-teal-50 hover:bg-white/20"
            }`}
          >
            Vehicle Bookings
          </button>
        </div>
      </header>

      <div className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-2 pl-10 pr-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-xl border border-gray-300 p-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
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
              <tr className="bg-gradient-to-r from-teal-600 to-teal-500 text-white">
                <th className="px-4 py-3 text-left font-semibold">Booking ID</th>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">
                  {bookingType === "bus" ? "Bus" : "Vehicle"}
                </th>
                {bookingType === "bus" ? (
                  <th className="px-4 py-3 text-left font-semibold">Seats</th>
                ) : (
                  <>
                    <th className="px-4 py-3 text-left font-semibold">Pickup</th>
                    <th className="px-4 py-3 text-left font-semibold">Drop</th>
                  </>
                )}
                <th className="px-4 py-3 text-right font-semibold">Price</th>
                <th className="px-4 py-3 text-right font-semibold">Commission</th>
                <th className="px-4 py-3 text-right font-semibold">Vendor Earnings</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {pagedBookings.map((booking) => (
                <tr key={booking._id} className="transition-colors hover:bg-teal-50/40">
                  <td
                    className="px-4 py-3 font-mono text-xs font-semibold text-slate-600"
                    title={booking._id}
                  >
                    #{booking._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {booking.user?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {booking.bus?.name || booking.vehicle?.name || "N/A"}
                  </td>
                  {bookingType === "bus" ? (
                    <td className="px-4 py-3 text-gray-700">
                      {booking.selectedSeats?.join(", ") || "—"}
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-gray-700">
                        {booking.pickupPoint || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{booking.dropPoint || "—"}</td>
                    </>
                  )}
                  <td className="px-4 py-3 text-right font-semibold text-teal-700">
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
                        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                          Cash on Visit
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {booking.createdAt
                      ? new Date(booking.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
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
                        ? "bg-teal-600 text-white"
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