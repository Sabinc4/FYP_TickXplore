import { useState } from "react";
import DataTable from "../../Component/Admin_DataTable";
import { useOutletContext } from "react-router-dom";
import type { Booking } from "../../api";

interface OutletContext {
  bookings: Booking[];
  loading: boolean;
  error: string;
}

const Bookings = () => {
  const { bookings, loading, error } = useOutletContext<OutletContext>();
  const [bookingType, setBookingType] = useState<"bus" | "vehicle">("bus");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

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

  const fields =
    bookingType === "bus"
      ? [
          "_id",
          "user.name",
          "bus.name",
          "selectedSeats",
          "totalPrice",
          "commissionAmount",
          "vendorEarnings",
          "status",
          "createdAt",
        ]
      : [
          "_id",
          "user.name",
          "vehicle.name",
          "pickupPoint",
          "dropPoint",
          "totalPrice",
          "commissionAmount",
          "vendorEarnings",
          "status",
          "createdAt",
        ];

  const headers =
    bookingType === "bus"
      ? ["Booking ID", "User", "Bus", "Seats", "Price", "Commission", "Vendor Earnings", "Status", "Date"]
      : ["Booking ID", "User", "Vehicle", "Pickup", "Drop", "Price", "Commission", "Vendor Earnings", "Status", "Date"];

  const renderCell = (item: Booking, field: string): string | number | null => {
    if (field.includes(".")) {
      const value = field.split(".").reduce<unknown>((obj, key) => {
        if (obj && typeof obj === "object") {
          return (obj as Record<string, unknown>)[key];
        }
        return undefined;
      }, item as unknown);
      return value != null ? String(value) : null;
    }

    if (["commissionAmount", "vendorEarnings", "totalPrice"].includes(field)) {
      const value = item[field as keyof Booking];
      return typeof value === "number" ? `NPR ${value.toFixed(2)}` : null;
    }

    if (field === "selectedSeats") {
      return item.selectedSeats?.length ? item.selectedSeats.join(", ") : null;
    }

    if (field === "createdAt") {
      const value = item[field as keyof Booking];
      return typeof value === "string" ? new Date(value).toLocaleString() : null;
    }

    const value = item[field as keyof Booking];
    return value != null ? String(value) : null;
  };

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>Error loading bookings: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center">
        <button
          onClick={() => setBookingType("bus")}
          className={`rounded-l-md px-4 py-2 ${
            bookingType === "bus" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Bus Bookings
        </button>
        <button
          onClick={() => setBookingType("vehicle")}
          className={`rounded-r-md px-4 py-2 ${
            bookingType === "vehicle" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Vehicle Bookings
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:max-w-xs"
        />
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

      <DataTable<Booking>
        key={`${bookingType}-${searchQuery}-${dateFilter}`}
        title={`${bookingType === "bus" ? "Bus" : "Vehicle"} Bookings`}
        data={filteredBookings}
        fields={fields}
        headers={headers}
        renderCell={renderCell}
        disableEdit={true}
      />
    </div>
  );
};

export default Bookings;