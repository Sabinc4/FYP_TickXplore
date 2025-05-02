import React from "react";
import { useOutletContext } from "react-router-dom";

const Bookings = () => {
  const { bookings } = useOutletContext();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Bus Bookings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-300">
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
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="px-6 py-4 text-gray-900 font-medium">{booking._id}</td>
                <td className="px-6 py-4">{booking.userId?.name || "N/A"}</td>
                <td className="px-6 py-4">{booking.busId?.name || booking.vehicleId?.name || "N/A"}</td>
                <td className="px-6 py-4">{booking.selectedSeats?.join(", ") || "N/A"}</td>
                <td className="px-6 py-4">Rs. {booking.totalPrice?.toFixed(2) || "0.00"}</td>
                <td className="px-6 py-4">Rs. {booking.commissionAmount?.toFixed(2) || "0.00"}</td>
                <td className="px-6 py-4">Rs. {booking.vendorEarnings?.toFixed(2) || "0.00"}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.status === "Booked" ? "bg-green-100 text-green-800"
                    : booking.status === "Pending" ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(booking.createdAt).toLocaleDateString() || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default Bookings;
