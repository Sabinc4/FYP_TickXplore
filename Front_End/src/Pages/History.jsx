import React from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

const Bookings = () => {
  const { bookings, fetchData } = useOutletContext();

  const handleRefund = async (bookingId, refundAmount) => {
    try {
      const res = await axios.post(`http://localhost:3001/api/bookings/refund/${bookingId}`, {
        refundAmount,
      });
      toast.success(res.data.message);
      fetchData(); // Refresh data after refund
    } catch (error) {
      const message = error.response?.data?.message || "Refund failed.";
      toast.error(message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Refund</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="px-6 py-4 text-sm text-gray-900">#{booking._id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">₹{booking.totalPrice.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "Booked"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {booking.status === "Cancelled" && !booking.isRefunded ? (
                    <button
                      onClick={() => handleRefund(booking._id, booking.totalPrice)}
                      className="px-4 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      Refund ₹{booking.totalPrice}
                    </button>
                  ) : booking.isRefunded ? (
                    <span className="text-xs text-green-600 font-medium">Refunded</span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
